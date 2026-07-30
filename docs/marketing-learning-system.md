# Run Lighter Marketing Learning System

## Purpose

The Run Lighter Marketing Learning System connects ad delivery, leads, follow-up outcomes and the next creative brief.

Its commercial objective is narrow:

> Find more suitable Sydney business owners at an acceptable acquisition cost, while keeping claims, budgets and client judgement under human control.

It does not optimise for clicks alone. A booked, suitable conversation matters more than a cheap form submission.

## End-to-end sequence

1. Read the previous seven days of Run Lighter ad-level Meta performance.
2. Retrieve new leads from the Run Lighter instant form.
3. Add new leads to the local lead register without creating duplicates.
4. Optionally send each new lead to an approved webhook for Google Sheets, Brevo or another lightweight destination.
5. Read the lead statuses Adrian has recorded after contact.
6. Join ad delivery to lead, qualification, booking and client outcomes.
7. Classify each ad as winner, learning, hold or pause-review.
8. Prepare a one-paragraph account theory.
9. Put no more than four properly evidenced weak ads into the action queue.
10. Create a performance-informed candidate for the next Run Lighter content and ad brief.
11. Feed that candidate into the existing topic engine, where duplication and brand checks still apply.
12. Save an audit record with no contact details or secrets.

## What is implemented

### Meta performance adapter

`src/lib/marketing-agent/meta.mjs`

- Reads ad identity and effective status.
- Reads ad-level spend, impressions, clicks and lead actions.
- Retrieves instant-form leads.
- Uses bearer authorisation headers so access tokens are not placed in URLs.
- Supports pagination.
- Supports a file adapter for local testing.
- Can pause a confirmed ad only when every live safety flag passes.

The Meta API version remains configurable because supported versions change. Confirm the current official Meta Marketing API version before enabling live mode.

### Private lead register

`leads/run-lighter-meta-leads.csv`

The lead register remains local and is ignored by Git. It contains:

- Meta lead ID
- contact details
- campaign, ad set and ad name
- follow-up owner
- contact time
- qualification status
- notes

The system never writes contact details into committed marketing reports.

### Decision engine

`src/lib/marketing-agent/decision.mjs`

The default evidence gate is:

- at least AUD 20 spend, or
- at least 1,000 impressions, and
- at least 72 hours since creation

An ad with a lead remains in learning. An ad with two leads or a recorded qualified outcome becomes a winner. An ad with sufficient evidence and no leads becomes a pause-review candidate.

These thresholds are configurable. They are not universal advertising rules.

### Performance-informed creative signal

`data/marketing-agent/latest-signal.json`

A live run writes one aggregate, non-personal creative signal. The existing content engine reads it only when:

- the run was live rather than a fixture;
- the signal date matches the content date;
- the candidate passes the normal duplication threshold.

Performance evidence provides a controlled score boost. It does not bypass brand, claim, visual or editorial checks.

### Audit and action records

Live runs write:

- `data/marketing-agent/runs/YYYY-MM-DD.json`
- `data/marketing-agent/action-queue/YYYY-MM-DD.json`
- `data/marketing-agent/latest-signal.json`
- `data/marketing-agent/state.json`

Dry runs write to ignored `data/runtime/marketing-agent/`.

Stable action IDs prevent the same pause action from being applied twice.

## Commands

### Full fixture dry run

```bash
npm run marketing:dry-run
```

### View current state

```bash
npm run marketing:status
```

### Test Meta credentials without changing anything

```bash
MARKETING_AGENT_DRY_RUN=false npm run marketing:credentials
```

### Live read and decision run

```bash
MARKETING_AGENT_DRY_RUN=false npm run marketing:daily -- --live
```

When a secure API token is not configured, the scheduled Codex run may collect the same aggregate fields from the verified Run Lighter Ads Manager session and save them in the ignored `data/marketing-agent/private/` directory. It can then run:

```bash
MARKETING_AGENT_DRY_RUN=false node scripts/marketing-agent/cli.mjs daily \
  --live \
  --fixture data/marketing-agent/private/YYYY-MM-DD.json
```

This trusted snapshot path supports the learning loop without committing a browser export or contact details. A file snapshot can never apply a Meta change.

### Apply properly evidenced pause actions

This remains deliberately difficult:

1. Set `allow_live_pauses` to `true` in `data/marketing-agent/control.json`.
2. Set `MARKETING_ALLOW_META_WRITES=true`.
3. Set `MARKETING_AGENT_DRY_RUN=false`.
4. Run:

```bash
node scripts/marketing-agent/cli.mjs daily --live --apply --confirm-live
```

Budget increases are not implemented. They remain an owner decision.

## Required secure configuration

The following values are needed for an unattended live Meta run:

- `META_ACCESS_TOKEN`
- `META_API_VERSION`
- `META_AD_ACCOUNT_ID`
- `META_CAMPAIGN_ID`
- `META_AD_SET_ID`
- `META_LEAD_FORM_ID`

Optional lead delivery:

- `MARKETING_LEAD_WEBHOOK_URL`
- `MARKETING_LEAD_WEBHOOK_SECRET`

No secret should be committed to the repository.

## Scheduling

The existing Codex automation remains the single 5:00 am Australia/Sydney scheduler. It should run the marketing learning pass before creating the daily content package.

GitHub Actions remains manual recovery only. This avoids two systems publishing or making decisions for the same day.

The daily order is:

1. Inspect the live account and sync leads.
2. Run the marketing learning system.
3. Review the generated theory and action queue.
4. Use the live performance signal in the content brief.
5. Generate, validate and publish the coordinated website, Instagram and Facebook package.
6. Record post IDs and later feed lead quality back into the next run.

## Safety

- Live changes are disabled by default.
- The kill switch blocks the run.
- The account ID is checked before live activity.
- Contact details remain outside Git.
- A fixture run cannot change Meta.
- A weak ad is not judged before the delivery and observation thresholds.
- No automatic budget increases are supported.
- Every recommended or applied action has a stable ID and audit record.
- Failed validation prevents publication.
