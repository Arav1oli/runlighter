import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildSite, markdownToHtml } from '../../src/lib/site-builder.mjs';
import { loadConfig } from '../../src/lib/config.mjs';
import { fromRoot } from '../../src/lib/utils.mjs';

test('markdown renderer preserves semantic headings and lists',()=>{
  const html=markdownToHtml('# Hidden H1\n\n## Section\n\n1. First\n2. Second');
  assert.equal(html.includes('<h2>Section</h2>'),true);assert.equal(html.includes('<ol>'),true);assert.equal(html.includes('<h1>'),false);
});

test('site build emits valid feed, sitemap and excludes drafts',async()=>{
  const config=loadConfig();const result=await buildSite(config);assert.ok(result.paths.includes('feed.xml'));
  const [feed,sitemap,listing]=await Promise.all([readFile(fromRoot('feed.xml'),'utf8'),readFile(fromRoot('sitemap.xml'),'utf8'),readFile(fromRoot('blog','index.html'),'utf8')]);
  assert.match(feed,/^<\?xml/);assert.match(sitemap,/<urlset/);assert.equal(listing.includes('status":"draft'),false);
});
