const groupUrl = 'https://runlighter.com/group/';
const brands = [
  { key: 'asado', name: 'Asado Works', url: 'https://asadoworks.com/', description: 'Cooking, hosting & everyday living' },
  { key: 'runlighter', name: 'Run Lighter', url: 'https://runlighter.com/', description: 'Business systems & services' },
  { key: 'italian', name: 'Italian homewares', url: 'https://runlighter.com/group/italian-homewares/', description: 'Brand name in development' }
];

export function groupRibbon(current = 'runlighter') {
  return `<div class="group-ribbon"><div class="group-ribbon-inner"><a class="group-ribbon-parent" href="${groupUrl}"${current === 'group' ? ' aria-current="page" data-i18n="networkParent"' : ''}>${current === 'group' ? 'Run Lighter Group' : 'Part of Run Lighter Group'} <span aria-hidden="true">↗</span></a><nav class="group-ribbon-brands" aria-label="Run Lighter Group brands">${brands.map(brand => `<a href="${brand.url}"${current === brand.key ? ' aria-current="page"' : ''}${current === 'group' && brand.key === 'italian' ? ' data-i18n="networkItalian"' : ''}>${brand.name}</a>`).join('')}</nav></div></div>`;
}

export function groupFooter() {
  return `<section class="group-network-footer" aria-label="Run Lighter Group"><div class="group-network-inner"><div class="group-network-heading"><a href="${groupUrl}">Run Lighter Group <span aria-hidden="true">↗</span></a><p>Distinct brands. A shared foundation.</p></div><nav class="group-network-links" aria-label="Explore our group">${brands.map(brand => `<a href="${brand.url}"><span>${brand.name}</span><small>${brand.description}</small><b aria-hidden="true">↗</b></a>`).join('')}</nav></div></section>`;
}
