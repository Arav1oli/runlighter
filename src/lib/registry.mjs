import { fromRoot, readJson, writeJson } from './utils.mjs';

export const REGISTRY_PATH = fromRoot('data','content-registry.json');

export async function loadRegistry() {
  const registry = await readJson(REGISTRY_PATH, { version:1, entries:[] });
  if (!registry || registry.version !== 1 || !Array.isArray(registry.entries)) throw new Error('Invalid content registry schema');
  return registry;
}

export async function saveRegistry(registry) { await writeJson(REGISTRY_PATH, registry); }
export const findByDate = (registry, date) => registry.entries.find(entry => entry.date === date);
export const findByContentId = (registry, contentId) => registry.entries.find(entry => entry.content_id === contentId);

export function upsertRegistry(registry, entry) {
  const index = registry.entries.findIndex(item => item.content_id === entry.content_id);
  if (index === -1) registry.entries.push(entry); else registry.entries[index] = { ...registry.entries[index], ...entry };
  registry.entries.sort((a,b) => a.date.localeCompare(b.date));
  return registry;
}
