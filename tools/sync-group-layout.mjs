import { readFile, writeFile } from 'node:fs/promises';
import { groupRibbon, groupFooter, tramandiPublicUrl } from '../src/lib/group-network.mjs';

// Only outbound links change. Canonical URLs remain the intended brand domain.
const mapTramandiLinks = html => html.replace(/(<a\b[^>]*\bhref=")https:\/\/(?:tramandi\.com|tramandi\.pages\.dev)\/([^\"]*)"/g, (_, prefix, route) => `${prefix}${new URL(route, tramandiPublicUrl).href}"`);

const pages = ['index.html', 'spine.html', 'automated-marketing.html', 'lead-generation.html', 'security.html', 'book/index.html', 'privacy/index.html', 'accounting-firm-workflow-automation-sydney/index.html', 'accounting-workflow-check/index.html', 'group/index.html'];
for (const page of pages) {
  let html = await readFile(page, 'utf8');
  html = html.replace(/<!-- group-network:(?:ribbon|footer):start -->[\s\S]*?<!-- group-network:(?:ribbon|footer):end -->/g, '');
  html = html.replace(/<link[^>]*href="\/assets\/group-network\.css[^\"]*"[^>]*>/g, '');
  html = html.replace(/<script src="\/assets\/group-network\.js[^\"]*"[^>]*><\/script>/g, '');
  html = mapTramandiLinks(html);
  html = html.replace('</head>', '<link rel="stylesheet" href="/assets/group-network.css?v=20261012-1"></head>');
  const isGroup = page === 'group/index.html';
  html = html.replace(/<body([^>]*)>/, (tag, attrs) => {
    if (!isGroup && !attrs.includes('rl-family-site')) {
      attrs = attrs.includes('class="') ? attrs.replace('class="', 'class="rl-family-site ') : `${attrs} class="rl-family-site"`;
    }
    return `<body${attrs}><!-- group-network:ribbon:start -->${groupRibbon(isGroup ? 'group' : 'runlighter')}<!-- group-network:ribbon:end -->`;
  });
  if (!isGroup) html = html.replace('<footer', `<!-- group-network:footer:start -->${groupFooter()}<!-- group-network:footer:end --><footer`);
  if (!isGroup) html = html.replace('</body>', '<script src="/assets/group-network.js?v=20261012-1" defer></script></body>');
  await writeFile(page, html);
}
console.log(`Updated group layout on ${pages.length} static pages.`);

const legacyPages = ['', 'story/', 'products/fatto/', 'products/tavola/', 'products/pausa/'];
for (const legacyBrand of ['italian-homewares', 'sitorna']) {
  for (const route of legacyPages) {
    const page = `group/${legacyBrand}/${route}index.html`;
    const destination = new URL(route, tramandiPublicUrl).href;
    let html = mapTramandiLinks(await readFile(page, 'utf8'));
    html = html.replace(/(<meta http-equiv="refresh" content="0; url=)[^\"]*(")/, `$1${destination}$2`);
    html = html.replace(/new URL\('https:\/\/(?:tramandi\.com|tramandi\.pages\.dev)\/[^']*'\)/, `new URL('${destination}')`);
    await writeFile(page, html);
  }
}
console.log(`Updated working destinations on ${legacyPages.length * 2} legacy redirects; canonical URLs retained.`);
