const FIELD_ALIASES = {
  full_name: 'Full Name',
  name: 'Full Name',
  email: 'Email',
  phone_number: 'Phone',
  phone: 'Phone'
};

const WON_STATUSES = new Set(['won', 'client', 'closed won']);
const QUALIFIED_STATUSES = new Set(['qualified', 'booked', 'attended', 'proposed', 'won', 'client', 'closed won']);
const BOOKED_STATUSES = new Set(['booked', 'attended', 'proposed', 'won', 'client', 'closed won']);

function fieldMap(fieldData = []) {
  return Object.fromEntries(fieldData.map(field => [field.name, Array.isArray(field.values) ? field.values.join(', ') : String(field.values || '')]));
}

export function metaLeadToRow(lead, defaults = {}) {
  const values = fieldMap(lead.field_data);
  const row = {
    'Lead Received At': lead.created_time || '',
    'Meta Lead ID': lead.id || '',
    'Full Name': '',
    Email: '',
    Phone: '',
    'Campaign Name': defaults.campaignName || lead.campaign_name || '',
    'Ad Set Name': defaults.adSetName || lead.adset_name || '',
    'Ad Name': lead.ad_name || defaults.adName || '',
    'Form Name': defaults.formName || '',
    Platform: defaults.platform || 'Meta',
    Status: 'New',
    'Follow-up Owner': defaults.owner || 'Adrian',
    'First Contact At': '',
    Notes: ''
  };
  for (const [key, value] of Object.entries(values)) {
    const header = FIELD_ALIASES[key];
    if (header) row[header] = value;
  }
  return row;
}

export function summariseLeadOutcomes(rows) {
  const byAdName = {};
  for (const row of rows) {
    const adName = row['Ad Name'] || 'Unknown ad';
    const status = String(row.Status || 'New').trim().toLowerCase();
    const summary = byAdName[adName] || {
      leads: 0,
      contacted: 0,
      qualified: 0,
      booked: 0,
      won: 0,
      lost: 0
    };
    summary.leads += 1;
    if (row['First Contact At'] || !['new', ''].includes(status)) summary.contacted += 1;
    if (QUALIFIED_STATUSES.has(status)) summary.qualified += 1;
    if (BOOKED_STATUSES.has(status)) summary.booked += 1;
    if (WON_STATUSES.has(status)) summary.won += 1;
    if (status === 'lost' || status === 'unqualified') summary.lost += 1;
    byAdName[adName] = summary;
  }
  return {
    total: rows.length,
    contacted: Object.values(byAdName).reduce((sum, item) => sum + item.contacted, 0),
    qualified: Object.values(byAdName).reduce((sum, item) => sum + item.qualified, 0),
    booked: Object.values(byAdName).reduce((sum, item) => sum + item.booked, 0),
    won: Object.values(byAdName).reduce((sum, item) => sum + item.won, 0),
    by_ad_name: byAdName
  };
}

export async function deliverLeadWebhook(config, newRows, fetchImpl = fetch) {
  if (!config.leadWebhookUrl || !newRows.length) return { configured: false, delivered: 0 };
  let delivered = 0;
  for (const row of newRows) {
    const response = await fetchImpl(config.leadWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.webhookSecret ? { 'X-Run-Lighter-Secret': config.webhookSecret } : {})
      },
      body: JSON.stringify(row)
    });
    if (!response.ok) throw new Error(`Lead webhook returned HTTP ${response.status}`);
    delivered += 1;
  }
  return { configured: true, delivered };
}
