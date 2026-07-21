import path from 'node:path';
import { open, rm } from 'node:fs/promises';
import { ensureDir, fromRoot, writeJson } from './utils.mjs';

export function lockPath(date, kind) { return fromRoot('data','locks',`${date}-${kind}.lock`); }

export async function acquireLock(date, kind) {
  const target = lockPath(date,kind);
  await ensureDir(path.dirname(target));
  try {
    const handle = await open(target,'wx');
    await handle.writeFile(JSON.stringify({ date, kind, pid:process.pid, created_at:new Date().toISOString() }));
    await handle.close();
    return target;
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`${kind} lock already exists for ${date}`);
    throw error;
  }
}

export async function releaseLock(target) { await rm(target,{force:true}); }

export async function withLock(date, kind, operation) {
  const target = await acquireLock(date,kind);
  try { return await operation(); }
  finally { await releaseLock(target); }
}
