import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { ensureDir, exists, writeText } from '../utils.mjs';

export const LEAD_HEADERS = [
  'Lead Received At',
  'Meta Lead ID',
  'Full Name',
  'Email',
  'Phone',
  'Campaign Name',
  'Ad Set Name',
  'Ad Name',
  'Form Name',
  'Platform',
  'Status',
  'Follow-up Owner',
  'First Contact At',
  'Notes'
];

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
}

const escapeCell = value => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export function stringifyCsv(rows, headers = LEAD_HEADERS) {
  const lines = [headers.map(escapeCell).join(',')];
  for (const row of rows) lines.push(headers.map(header => escapeCell(row[header])).join(','));
  return `${lines.join('\n')}\n`;
}

export async function readLeadCsv(target) {
  if (!await exists(target)) return [];
  const parsed = parseCsv(await readFile(target, 'utf8'));
  if (!parsed.length) return [];
  const headers = parsed[0];
  return parsed.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

export async function writeLeadCsv(target, rows) {
  await ensureDir(path.dirname(target));
  await writeText(target, stringifyCsv(rows));
}

export async function upsertLeadRows(target, incoming) {
  const rows = await readLeadCsv(target);
  const byId = new Map(rows.filter(row => row['Meta Lead ID']).map(row => [row['Meta Lead ID'], row]));
  let inserted = 0;
  for (const lead of incoming) {
    const id = lead['Meta Lead ID'];
    if (!id || byId.has(id)) continue;
    rows.push(Object.fromEntries(LEAD_HEADERS.map(header => [header, lead[header] || ''])));
    byId.set(id, lead);
    inserted += 1;
  }
  rows.sort((left, right) => String(left['Lead Received At']).localeCompare(String(right['Lead Received At'])));
  await writeLeadCsv(target, rows);
  return { rows, inserted };
}
