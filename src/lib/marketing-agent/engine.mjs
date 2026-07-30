import path from 'node:path';
import { readLeadCsv, upsertLeadRows } from './csv.mjs';
import { metaLeadToRow, summariseLeadOutcomes, deliverLeadWebhook } from './leads.mjs';
import { getMetaAdapter } from './meta.mjs';
import { analyseMarketingSnapshot } from './decision.mjs';
import { addDays, ensureDir, fromRoot, readJson, writeJson, exists, sha256 } from '../utils.mjs';
import { withRetry } from '../retry.mjs';

const controlPath = () => fromRoot('data', 'marketing-agent', 'control.json');
const statePath = () => fromRoot('data', 'marketing-agent', 'state.json');
const liveRoot = () => fromRoot('data', 'marketing-agent');
const runtimeRoot = () => fromRoot('data', 'runtime', 'marketing-agent');

function outputPaths(date, dryRun) {
  const root = dryRun ? runtimeRoot() : liveRoot();
  return {
    root,
    run: path.join(root, 'runs', `${date}.json`),
    actions: path.join(root, 'action-queue', `${date}.json`),
    signal: path.join(root, 'latest-signal.json'),
    state: dryRun ? path.join(root, 'state.json') : statePath()
  };
}

export function dateWindow(date, lookbackDays) {
  return { since: addDays(date, -(Math.max(1, lookbackDays) - 1)), until: date };
}

async function loadControl(config) {
  const control = await readJson(controlPath(), {
    paused: false,
    kill_switch: false,
    allow_live_pauses: false,
    maximum_pauses_per_run: config.maximumPauseRecommendations
  });
  if (control.paused) throw new Error('Marketing learning system is paused');
  if (control.kill_switch || config.killSwitch) throw new Error('Marketing learning system kill switch is enabled');
  return control;
}

async function loadState(target) {
  return readJson(target, {
    version: 1,
    last_run_at: '',
    last_run_date: '',
    last_meta_sync_at: '',
    last_lead_sync_at: '',
    seen_lead_ids: [],
    applied_actions: []
  });
}

function publicRunReport(analysis, leadSummary, sync, webhook, mode, blockers = []) {
  return {
    system: 'Run Lighter Marketing Learning System',
    mode,
    date: analysis.date,
    generated_at: analysis.generated_at,
    source: analysis.source,
    window: analysis.window,
    account_id: analysis.account_id,
    campaign_id: analysis.campaign_id,
    summary: analysis.summary,
    lead_pipeline: {
      total: leadSummary.total,
      contacted: leadSummary.contacted,
      qualified: leadSummary.qualified,
      booked: leadSummary.booked,
      won: leadSummary.won,
      newly_synced: sync.inserted,
      webhook_delivered: webhook.delivered
    },
    theory: analysis.theory,
    ads: analysis.ads.map(ad => ({
      ad_id: ad.ad_id,
      ad_name: ad.ad_name,
      effective_status: ad.effective_status,
      spend: ad.spend,
      impressions: ad.impressions,
      clicks: ad.clicks,
      leads: ad.leads,
      qualified: ad.qualified,
      booked: ad.booked,
      won: ad.won,
      classification: ad.classification,
      reason: ad.reason
    })),
    recommended_actions: analysis.actions,
    next_test: analysis.next_test,
    blockers,
    status: blockers.length ? 'completed-with-blockers' : 'completed'
  };
}

export async function runMarketingLearningSystem(config, {
  date,
  snapshotPath = '',
  apply = false,
  confirmLive = false
} = {}) {
  const dryRun = config.dryRun;
  const paths = outputPaths(date, dryRun);
  const control = await loadControl(config);
  await ensureDir(paths.root);
  const state = await loadState(paths.state);
  const effectiveSnapshot = snapshotPath || config.snapshotPath;
  const adapter = getMetaAdapter(config, { snapshotPath: effectiveSnapshot });
  const window = dateWindow(date, config.lookbackDays);
  const snapshot = await withRetry(
    () => adapter.fetchSnapshot(window),
    { retries: effectiveSnapshot ? 0 : 2, baseDelayMs: 1500 }
  );
  const rawLeads = await withRetry(
    () => adapter.fetchLeads(),
    { retries: effectiveSnapshot ? 0 : 2, baseDelayMs: 1500 }
  );
  const incomingRows = rawLeads.map(lead => metaLeadToRow(lead, {
    campaignName: snapshot.campaign_name || 'RL 1',
    adSetName: snapshot.ad_set_name || 'R L ad set',
    formName: snapshot.form_name || 'RL Ad',
    platform: 'Meta',
    owner: 'Adrian'
  }));
  const seen = new Set(state.seen_lead_ids || []);
  const newRows = incomingRows.filter(row => row['Meta Lead ID'] && !seen.has(row['Meta Lead ID']));
  const sync = dryRun
    ? { rows: await readLeadCsv(config.leadCsvPath), inserted: newRows.length }
    : await upsertLeadRows(config.leadCsvPath, newRows);
  const webhook = dryRun
    ? { configured: Boolean(config.leadWebhookUrl), delivered: 0 }
    : await deliverLeadWebhook(config, newRows);
  const leadRows = dryRun
    ? [...sync.rows, ...newRows]
    : sync.rows;
  const leadSummary = summariseLeadOutcomes(leadRows);
  const analysis = analyseMarketingSnapshot(snapshot, leadSummary, config, date);
  const blockers = [];
  const applied = [];
  if (apply && analysis.actions.length) {
    if (!control.allow_live_pauses) {
      blockers.push('Live pausing is disabled in data/marketing-agent/control.json');
    } else {
      const alreadyApplied = new Set(state.applied_actions || []);
      for (const action of analysis.actions) {
        if (alreadyApplied.has(action.action_id)) {
          applied.push({ ...action, status: 'already-applied' });
          continue;
        }
        const result = await adapter.pauseAd(action.ad_id, { confirmLive });
        applied.push({ ...action, status: 'applied', applied_at: new Date().toISOString(), result_hash: sha256(JSON.stringify(result)).slice(0, 12) });
        alreadyApplied.add(action.action_id);
      }
      state.applied_actions = [...alreadyApplied];
    }
  }
  const report = publicRunReport(analysis, leadSummary, sync, webhook, dryRun ? 'dry-run' : 'live', blockers);
  report.applied_actions = applied;
  await writeJson(paths.run, report);
  await writeJson(paths.actions, {
    date,
    generated_at: report.generated_at,
    account_id: report.account_id,
    campaign_id: report.campaign_id,
    apply_requested: apply,
    applied_actions: applied,
    recommended_actions: report.recommended_actions,
    blockers
  });
  await writeJson(paths.signal, {
    date,
    generated_at: report.generated_at,
    mode: dryRun ? 'fixture' : 'live',
    candidate: report.next_test,
    evidence_summary: report.summary,
    theory: report.theory
  });
  state.last_run_at = report.generated_at;
  state.last_run_date = date;
  state.last_meta_sync_at = snapshot.fetched_at || report.generated_at;
  state.last_lead_sync_at = report.generated_at;
  state.seen_lead_ids = [...new Set([...(state.seen_lead_ids || []), ...incomingRows.map(row => row['Meta Lead ID']).filter(Boolean)])];
  await writeJson(paths.state, state);
  return { report, paths };
}

export async function marketingStatus() {
  const state = await readJson(statePath(), null);
  const signal = await readJson(path.join(liveRoot(), 'latest-signal.json'), null);
  const control = await readJson(controlPath(), null);
  return { control, state, latest_signal: signal };
}

export async function latestMarketingCandidate(date) {
  const signalPath = path.join(liveRoot(), 'latest-signal.json');
  if (!await exists(signalPath)) return null;
  const signal = await readJson(signalPath);
  if (signal.mode !== 'live' || signal.date !== date || !signal.candidate) return null;
  return signal.candidate;
}
