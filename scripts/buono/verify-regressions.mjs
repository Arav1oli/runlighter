import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');
const routeRoot = path.join(runlighterRoot, 'launchpads/buono');
const releaseManifestPath = path.join(routeRoot, 'release-manifest.json');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

assert.ok(existsSync(releaseManifestPath), 'Buono release manifest is missing before regression checks');
const routeHashBefore = sha256(readFileSync(releaseManifestPath));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: runlighterRoot,
    stdio: 'inherit',
    encoding: 'utf8',
  });
  assert.equal(result.error, undefined, `${command} could not start: ${result.error?.message ?? 'unknown error'}`);
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed with exit ${result.status}`);
}

run('npm', ['test']);
run('npm', ['run', 'build']);

assert.ok(existsSync(path.join(routeRoot, 'index.html')), 'Run Lighter build removed the Buono route');
assert.ok(existsSync(releaseManifestPath), 'Run Lighter build removed the Buono release manifest');
assert.equal(sha256(readFileSync(releaseManifestPath)), routeHashBefore, 'Run Lighter build changed the Buono release package');

const cname = readFileSync(path.join(runlighterRoot, 'CNAME'), 'utf8').trim();
const config = readFileSync(path.join(runlighterRoot, '_config.yml'), 'utf8');
const homepage = readFileSync(path.join(runlighterRoot, 'index.html'), 'utf8');
const sitemap = readFileSync(path.join(runlighterRoot, 'sitemap.xml'), 'utf8');
const feed = readFileSync(path.join(runlighterRoot, 'feed.xml'), 'utf8');
const robots = readFileSync(path.join(runlighterRoot, 'robots.txt'), 'utf8');

assert.equal(cname, 'runlighter.com');
assert.match(config, /^url:\s*https:\/\/runlighter\.com\s*$/m);
assert.match(config, /^\s*- scripts\s*$/m, 'Run Lighter must continue excluding verifier scripts from Pages output');
assert.match(homepage, /<link rel="canonical" href="https:\/\/runlighter\.com\/">/);
assert.match(homepage, /<meta name="robots" content="index,follow/i);
assert.match(sitemap, /https:\/\/runlighter\.com\/blog\//);
assert.match(sitemap, /https:\/\/runlighter\.com\/privacy\//);
assert.match(robots, /Sitemap:\s*https:\/\/runlighter\.com\/sitemap\.xml/);

for (const [name, content] of [['homepage', homepage], ['sitemap', sitemap], ['feed', feed], ['robots', robots]]) {
  assert.doesNotMatch(content, /launchpads\/buono/i, `Private Buono route leaked into the public ${name}`);
}

console.log('RUNLIGHTER_REGRESSIONS_VERIFIED');
