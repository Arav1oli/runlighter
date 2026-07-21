import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, stat, rm } from 'node:fs/promises';
import path from 'node:path';

export const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
export const fromRoot = (...parts) => path.join(ROOT, ...parts);

export async function ensureDir(target) { await mkdir(target, { recursive: true }); }
export async function readJson(target, fallback = null) {
  try { return JSON.parse(await readFile(target, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT' && fallback !== null) return fallback; throw error; }
}
export async function writeJson(target, value) {
  await ensureDir(path.dirname(target));
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, target);
}
export async function writeText(target, value) {
  await ensureDir(path.dirname(target));
  await writeFile(target, value, 'utf8');
}
export async function exists(target) { try { await stat(target); return true; } catch { return false; } }
export async function removeIfExists(target) { await rm(target, { recursive: true, force: true }); }
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
export const stableId = (date, topic) => `rl-${date}-${sha256(topic).slice(0, 10)}`;
export const uniqueId = () => randomUUID();
export const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
export const words = (value) => String(value).trim().split(/\s+/).filter(Boolean);
export const wordCount = (value) => words(value.replace(/<[^>]+>/g, ' ')).length;
export const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);
export const escapeXml = escapeHtml;
export const formatAuDate = (date) => new Intl.DateTimeFormat('en-AU', { day:'numeric', month:'long', year:'numeric', timeZone:'Australia/Sydney' }).format(new Date(`${date}T12:00:00+10:00`));
export const addDays = (date, count) => {
  const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + count); return value.toISOString().slice(0, 10);
};
export const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
export const redact = (value) => String(value).replace(/(?:Bearer\s+)?(?:EA[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{12,})/g, '[REDACTED]');

export function zonedParts(date = new Date(), timeZone = 'Australia/Sydney') {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'
  }).formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}`, ...parts };
}

export function inExecutionWindow(now, target, minutes = 15, timeZone = 'Australia/Sydney') {
  const { time } = zonedParts(now, timeZone);
  const [currentHour, currentMinute] = time.split(':').map(Number);
  const [targetHour, targetMinute] = target.split(':').map(Number);
  const current = currentHour * 60 + currentMinute;
  const desired = targetHour * 60 + targetMinute;
  return current >= desired && current < desired + minutes;
}
