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
  const config=loadConfig({RUN_LIGHTER_SITE_URL:'https://runlighter.com'});const result=await buildSite(config);assert.ok(result.paths.includes('feed.xml'));
  const [feed,sitemap,listing,homepage,indexNowKey]=await Promise.all([readFile(fromRoot('feed.xml'),'utf8'),readFile(fromRoot('sitemap.xml'),'utf8'),readFile(fromRoot('blog','index.html'),'utf8'),readFile(fromRoot('index.html'),'utf8'),readFile(fromRoot(`${config.indexNowKey}.txt`),'utf8')]);
  assert.match(feed,/^<\?xml/);assert.match(sitemap,/<urlset/);assert.equal(listing.includes('status":"draft'),false);
  assert.equal(listing.includes('href="/blog/"'),true);assert.equal(listing.includes('/runlighter/'),false);
  assert.equal(feed.includes('https://runlighter.com/blog/'),true);
  assert.equal(sitemap.includes('https://runlighter.com/blog/'),true);
  assert.equal(sitemap.includes('https://runlighter.com/book/'),true);
  assert.equal(homepage.includes('<!-- latest-posts:start -->'),true);
  assert.equal(homepage.includes('class="article-card"'),true);
  assert.equal(homepage.includes('href="#contact"'),true);
  assert.equal(homepage.includes('class="article-image"'),true);
  assert.equal(homepage.includes('class="article-body"'),true);
  assert.equal(homepage.includes('class="article-copy"'),false);
  assert.equal((homepage.match(/class="article-card"/g)||[]).length,3);
  assert.equal(homepage.includes('class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation" hidden'),true);
  assert.equal(indexNowKey,config.indexNowKey);
  assert.ok(result.paths.includes(`${config.indexNowKey}.txt`));
});

test('site build retains a repository base path when configured',async()=>{
  const config=loadConfig({RUN_LIGHTER_SITE_URL:'https://arav1oli.github.io/runlighter'});
  try {
    await buildSite(config);
    const listing=await readFile(fromRoot('blog','index.html'),'utf8');
    assert.equal(listing.includes('href="/runlighter/blog/"'),true);
  } finally {
    await buildSite(loadConfig({RUN_LIGHTER_SITE_URL:'https://runlighter.com'}));
  }
});
