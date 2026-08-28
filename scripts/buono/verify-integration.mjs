import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');

for (const [script, marker] of [
  ['verify-finance.mjs', 'BUONO_FINANCE_CONTROLS_VERIFIED'],
  ['verify-static.mjs', 'BUONO_STATIC_ROUTE_VERIFIED'],
  ['verify-regressions.mjs', 'RUNLIGHTER_REGRESSIONS_VERIFIED'],
]) {
  const result = spawnSync(process.execPath, [path.join(scriptRoot, script)], {
    cwd: runlighterRoot,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  assert.equal(result.error, undefined, `${script} could not start: ${result.error?.message ?? 'unknown error'}`);
  assert.equal(result.status, 0, `${script} failed with exit ${result.status}`);
  assert.ok(result.stdout.includes(marker), `${script} did not emit ${marker}`);
}

console.log('BUONO_RUNLIGHTER_INTEGRATION_VERIFIED');
