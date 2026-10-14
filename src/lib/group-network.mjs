const groupUrl = 'https://runlighter.com/group/';
// Verified primary brand destination. Shared layouts and legacy redirects derive their links here.
export const tramandiPublicUrl = 'https://tramandi.com/';
export const tramandiRanges = [
  { key: 'fatto', name: 'Fatto', description: 'Pasta-making tools' },
  { key: 'tavola', name: 'Tavola', description: 'Bread-making tools' },
  { key: 'fuoco', name: 'Fuoco', description: 'Cooking over fire' },
  { key: 'custodia', name: 'Custodia', description: 'Salami-making tools' }
];
export const tramandiRangeRoute = route => route === 'products/pausa/' ? 'products/fuoco/' : route;
const brands = [
  { key: 'asado', name: 'Asado Works', url: 'https://asadoworks.com/', description: 'Cooking, hosting & everyday living' },
  { key: 'runlighter', name: 'Run Lighter', url: 'https://runlighter.com/', description: 'Business systems & services' },
  { key: 'tramandi', name: 'TRAMANDI', url: tramandiPublicUrl, description: 'Italian heritage. Everyday rituals.' }
];

export function groupRibbon(current = 'runlighter') {
  return `<div class="group-ribbon"><div class="group-ribbon-inner"><a class="group-ribbon-parent" href="${groupUrl}"${current === 'group' ? ' aria-current="page" data-i18n="networkParent"' : ''}>${current === 'group' ? 'Run Lighter Group' : 'Part of Run Lighter Group'} <span aria-hidden="true">↗</span></a><nav class="group-ribbon-brands" aria-label="Run Lighter Group brands">${brands.map(brand => `<a href="${brand.url}"${current === brand.key ? ' aria-current="page"' : ''}${current === 'group' && brand.key === 'tramandi' ? ' data-i18n="networkTramandi"' : ''}>${brand.name}</a>`).join('')}</nav></div></div>`;
}

export function groupFooter() {
  return `<section class="group-network-footer" aria-label="Run Lighter Group"><div class="group-network-inner"><div class="group-network-heading"><a href="${groupUrl}">Run Lighter Group <span aria-hidden="true">↗</span></a><p>Distinct brands. A shared foundation.</p></div><nav class="group-network-links" aria-label="Explore our group">${brands.map(brand => `<a href="${brand.url}"><span>${brand.name}</span><small>${brand.description}</small><b aria-hidden="true">↗</b></a>`).join('')}</nav></div></section>`;
}
