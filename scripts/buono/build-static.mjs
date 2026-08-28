import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');
const buonoSiteRoot = path.resolve(runlighterRoot, '../buono-launchpad/site');
const outputRoot = path.resolve(runlighterRoot, 'launchpads/buono');
const viteBin = path.resolve(buonoSiteRoot, 'node_modules/.bin/vite');
const configPath = path.resolve(scriptRoot, 'vite.config.mjs');

if (!existsSync(viteBin)) {
  throw new Error(`Vite is unavailable at ${viteBin}`);
}

const build = spawnSync(viteBin, ['build', '--config', configPath], {
  cwd: runlighterRoot,
  encoding: 'utf8',
  stdio: 'inherit',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

for (const forbidden of ['robots.txt', '.openai', 'server']) {
  rmSync(path.resolve(outputRoot, forbidden), { recursive: true, force: true });
}

function walk(directory, prefix = '') {
  return readdirSync(directory).flatMap((name) => {
    const absolute = path.join(directory, name);
    const relative = path.posix.join(prefix, name);
    return statSync(absolute).isDirectory() ? walk(absolute, relative) : [relative];
  });
}

const files = walk(outputRoot)
  .filter((file) => file !== 'release-manifest.json')
  .sort()
  .map((file) => {
    const bytes = readFileSync(path.join(outputRoot, file));
    return { file, bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex') };
  });

writeFileSync(path.join(outputRoot, 'release-manifest.json'), `${JSON.stringify({
  schema: 1,
  route: '/launchpads/buono/',
  source_publication: 'buono-launchpad/site/public/data/launchpad-evidence.json',
  file_count: files.length,
  files,
}, null, 2)}\n`);

console.log(`BUONO_STATIC_BUILD_COMPLETE files=${files.length}`);
