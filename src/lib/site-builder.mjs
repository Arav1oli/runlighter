import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { ensureDir, escapeHtml, escapeXml, formatAuDate, fromRoot, readJson, removeIfExists, writeText } from './utils.mjs';
import { DISCLOSURE } from './constants.mjs';

function inline(text, basePath = '') {
  const normalised = text.replace(/\]\(\/runlighter\//g,`](${basePath}/`);
  return escapeHtml(normalised).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[(.+?)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g,'<a href="$2">$1</a>');
}

export function markdownToHtml(markdown, { basePath = '' } = {}) {
  const lines=markdown.split(/\r?\n/);const output=[];let list=null;
  const close=()=>{if(list){output.push(`</${list}>`);list=null;}};
  for(const raw of lines){const line=raw.trim();if(!line){close();continue;}if(line.startsWith('# '))continue;
    if(line.startsWith('## ')){close();const title=line.slice(3);if(title==='Automation note')output.push(`<section class="automation-note" aria-labelledby="automation-note"><h2 id="automation-note">${inline(title,basePath)}</h2>`);else output.push(`<h2>${inline(title,basePath)}</h2>`);continue;}
    if(line.startsWith('### ')){close();output.push(`<h3>${inline(line.slice(4),basePath)}</h3>`);continue;}
    const ordered=line.match(/^\d+\.\s+(.+)/);const unordered=line.match(/^[-*]\s+(.+)/);
    if(ordered){if(list!=='ol'){close();list='ol';output.push('<ol>');}output.push(`<li>${inline(ordered[1],basePath)}</li>`);continue;}
    if(unordered){if(list!=='ul'){close();list='ul';output.push('<ul>');}output.push(`<li>${inline(unordered[1],basePath)}</li>`);continue;}
    close();output.push(`<p>${inline(line,basePath)}</p>`);if(output.at(-2)?.includes('id="automation-note"')&&line!==DISCLOSURE){} }
  close();
  const joined=output.join('\n');return joined.replace(/(<section class="automation-note"[\s\S]*?<p>[^<]*approved[^<]*<\/p>)/,'$1</section>');
}

async function loadPublished() {
  const directory=fromRoot('_content','blog');
  try { const files=await readdir(directory);const items=[];for(const file of files.filter(f=>f.endsWith('.json'))){const item=await readJson(path.join(directory,file));if(item.status==='published')items.push(item);}return items.sort((a,b)=>(b.published_at||b.date).localeCompare(a.published_at||a.date)); }
  catch(error){if(error.code==='ENOENT')return[];throw error;}
}

const basePathFor = siteUrl => {
  const pathname=new URL(siteUrl).pathname.replace(/\/$/,'');
  return pathname==='/'?'':pathname;
};
const atBase = (basePath, target = '/') => `${basePath}${target}`;

function head(content,{title,description,canonical,ogImage,type='website',jsonLd='',basePath=''}){return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${canonical}"><meta property="og:type" content="${type}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ogImage}"><meta property="og:locale" content="en_AU"><meta name="twitter:card" content="summary_large_image"><link rel="alternate" type="application/rss+xml" title="Run Lighter Blog" href="${atBase(basePath,'/feed.xml')}"><link rel="icon" href="${atBase(basePath,'/assets/favicon.png')}"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="${atBase(basePath,'/blog/styles.css')}">${jsonLd?`<script type="application/ld+json">${jsonLd.replace(/<\//g,'<\\/')}</script>`:''}</head><body><a class="skip" href="#main">Skip to content</a><header class="nav"><div class="container nav-inner"><a class="brand" href="${atBase(basePath,'/')}">RUN<span>/</span>LIGHTER</a><nav class="nav-links" aria-label="Main navigation"><a href="${atBase(basePath,'/#services')}">Services</a><a href="${atBase(basePath,'/#process')}">How it works</a><a href="${atBase(basePath,'/blog/')}" aria-current="page">Articles</a><a href="${atBase(basePath,'/#faq')}">FAQ</a><a class="button" href="${atBase(basePath,'/book/')}">Book a call</a></nav></div></header>`;}
const footer=()=>`<footer class="footer"><div class="container footer-inner"><span>© ${new Date().getFullYear()} Run Lighter</span><span>We automate repeated work, not judgement.</span></div></footer></body></html>`;

function articleCard(article,basePath=''){return `<article class="post-card"><picture><source srcset="${atBase(basePath,article.hero_image)}" type="image/webp"><img src="${atBase(basePath,article.hero_image_fallback)}" alt="${escapeHtml(article.hero_image_alt)}" width="1600" height="900" loading="lazy"></picture><div class="post-card-body"><div class="post-meta">${formatAuDate(article.date)} · ${article.reading_time} min read</div><h2><a href="${atBase(basePath,`/blog/${article.slug}/`)}">${escapeHtml(article.title)}</a></h2><p>${escapeHtml(article.excerpt)}</p><div class="post-card-foot"><span>${escapeHtml(article.author)}</span><span>${escapeHtml(article.category)}</span></div></div></article>`;}

function homepageArticleCard(article){
  return `<a class="article-card" href="blog/${article.slug}/"><picture><source srcset=".${article.hero_image}" type="image/webp"><img src=".${article.hero_image_fallback}" alt="${escapeHtml(article.hero_image_alt)}" width="1600" height="900" loading="lazy"></picture><div class="article-copy"><span>${escapeHtml(article.category)} · ${formatAuDate(article.date)}</span><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.excerpt)}</p><b>Read article →</b></div></a>`;
}

async function updateHomepageArticles(articles){
  const homepagePath=fromRoot('index.html');
  const homepage=await readFile(homepagePath,'utf8');
  const start='<!-- latest-posts:start -->';
  const end='<!-- latest-posts:end -->';
  if(!homepage.includes(start)||!homepage.includes(end))throw new Error('Homepage latest-post markers are missing');
  const cards=articles.slice(0,6).map(homepageArticleCard).join('');
  const replacement=`${start}<div class="article-track" id="articleTrack">${cards}</div>${end}`;
  await writeText(homepagePath,homepage.replace(new RegExp(`${start}[\\s\\S]*?${end}`),replacement));
}

function articleJsonLd(article,siteUrl){
  const organisationId=`${siteUrl}/#organisation`;
  const websiteId=`${siteUrl}/#website`;
  const articleNode={
    '@type':'Article',
    '@id':`${article.canonical_url}#article`,
    headline:article.title,
    description:article.description,
    datePublished:article.published_at||article.date,
    dateModified:article.updated_at||article.updated,
    author:{'@id':organisationId},
    publisher:{'@id':organisationId},
    image:[`${siteUrl}${article.og_image}`],
    mainEntityOfPage:{'@type':'WebPage','@id':article.canonical_url},
    articleSection:article.category,
    keywords:[article.primary_keyword,...(article.secondary_keywords||[])].filter(Boolean).join(', '),
    about:(article.secondary_keywords||[]).map(name=>({'@type':'Thing',name}))
  };
  if(article.search_question&&article.direct_answer){
    articleNode.mainEntity={
      '@type':'Question',
      name:article.search_question,
      acceptedAnswer:{'@type':'Answer',text:article.direct_answer}
    };
  }
  return JSON.stringify({
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':['Organization','ProfessionalService'],
        '@id':organisationId,
        name:'Run Lighter',
        url:`${siteUrl}/`,
        logo:`${siteUrl}/assets/favicon.png`,
        areaServed:{'@type':'City',name:'Sydney'},
        serviceType:['Business process automation','Workflow automation','AI automation consulting'],
        sameAs:['https://www.instagram.com/run_lighter/','https://www.facebook.com/profile.php?id=61592301111343']
      },
      {'@type':'WebSite','@id':websiteId,url:`${siteUrl}/`,name:'Run Lighter',publisher:{'@id':organisationId},inLanguage:'en-AU'},
      articleNode,
      {'@type':'BreadcrumbList','@id':`${article.canonical_url}#breadcrumb`,itemListElement:[
        {'@type':'ListItem',position:1,name:'Home',item:`${siteUrl}/`},
        {'@type':'ListItem',position:2,name:'Blog',item:`${siteUrl}/blog/`},
        {'@type':'ListItem',position:3,name:article.title,item:article.canonical_url}
      ]}
    ]
  });
}

export async function buildSite(config){
  const basePath=basePathFor(config.siteUrl);
  const articles=await loadPublished();await ensureDir(fromRoot('blog'));await writeText(fromRoot('blog','styles.css'),await readFile(fromRoot('src','templates','blog.css'),'utf8'));
  await updateHomepageArticles(articles);
  const listing=`${head('',{title:'Run Lighter Blog | Practical Business Automation',description:'Practical guides to reducing repeated work while keeping judgement and accountability human.',canonical:`${config.siteUrl}/blog/`,ogImage:`${config.siteUrl}/og.png`,basePath})}<main id="main"><section class="blog-hero"><div class="container"><span class="eyebrow">Practical automation</span><h1>Useful systems for lighter businesses.</h1><p>Clear guides for owners who want less repeated work, better handovers and more reliable follow-up.</p></div></section><section class="listing"><div class="container">${articles.length?`<div class="post-grid">${articles.map(article=>articleCard(article,basePath)).join('')}</div>`:'<div class="empty">Articles are being prepared. The first practical guide will appear here once publishing is enabled.</div>'}</div></section></main>${footer()}`;
  await writeText(fromRoot('blog','index.html'),listing);
  for(let index=0;index<articles.length;index+=1){const article=articles[index];const previous=articles[index+1],next=articles[index-1];const related=articles.filter(item=>item.slug!==article.slug&&item.tags.some(tag=>article.tags.includes(tag))).slice(0,2);const body=markdownToHtml(article.article_markdown,{basePath});const sources=article.source_urls.length?`<section class="sources"><h2>Sources</h2><ul>${article.source_urls.map(url=>`<li><a href="${escapeHtml(url)}" rel="noopener noreferrer">${escapeHtml(new URL(url).hostname)}</a></li>`).join('')}</ul></section>`:'';const navigation=`<nav class="post-nav" aria-label="Article navigation">${previous?`<a href="${atBase(basePath,`/blog/${previous.slug}/`)}">← ${escapeHtml(previous.title)}</a>`:'<span></span>'}${next?`<a href="${atBase(basePath,`/blog/${next.slug}/`)}">${escapeHtml(next.title)} →</a>`:'<span></span>'}</nav>`;const relatedHtml=related.length?`<section class="related"><div class="container"><h2>Related articles</h2><div class="post-grid">${related.map(item=>articleCard(item,basePath)).join('')}</div></div></section>`:'';const html=`${head('',{title:article.seo_title,description:article.meta_description,canonical:article.canonical_url,ogImage:`${config.siteUrl}${article.og_image}`,type:'article',jsonLd:articleJsonLd(article,config.siteUrl),basePath})}<main id="main"><header class="article-head"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${atBase(basePath,'/')}">Home</a> / <a href="${atBase(basePath,'/blog/')}">Blog</a> / <span>${escapeHtml(article.title)}</span></nav><span class="eyebrow">${escapeHtml(article.category)}</span><h1>${escapeHtml(article.title)}</h1><p class="article-intro">${escapeHtml(article.excerpt)}</p><div class="article-meta"><span>${formatAuDate(article.date)}</span><span>${article.reading_time} min read</span><span>By ${escapeHtml(article.author)}</span></div></div></header><picture class="hero-image"><source srcset="${atBase(basePath,article.hero_image)}" type="image/webp"><img src="${atBase(basePath,article.hero_image_fallback)}" alt="${escapeHtml(article.hero_image_alt)}" width="1600" height="900"></picture><div class="container article-layout"><article class="article-body">${body}${sources}${navigation}</article><aside class="sidebar"><h2>Find the first workflow worth fixing</h2><p>Request a short call and leave with one practical next step.</p><a class="button" href="${atBase(basePath,'/book/')}">Book a call</a><div class="tags">${article.tags.map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div></aside></div>${relatedHtml}</main>${footer()}`;await ensureDir(fromRoot('blog',article.slug));await writeText(fromRoot('blog',article.slug,'index.html'),html);}
  const rss=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Run Lighter Blog</title><link>${config.siteUrl}/blog/</link><description>Practical automation for growing businesses.</description><language>en-au</language>${articles.map(article=>`<item><title>${escapeXml(article.title)}</title><link>${article.canonical_url}</link><guid>${article.canonical_url}</guid><pubDate>${new Date(article.published_at||`${article.date}T07:00:00+10:00`).toUTCString()}</pubDate><description>${escapeXml(article.excerpt)}</description></item>`).join('')}</channel></rss>`;await writeText(fromRoot('feed.xml'),rss);
  const sitemap=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${config.siteUrl}/</loc></url><url><loc>${config.siteUrl}/book/</loc></url><url><loc>${config.siteUrl}/blog/</loc></url>${articles.map(article=>`<url><loc>${article.canonical_url}</loc><lastmod>${article.updated||article.date}</lastmod></url>`).join('')}</urlset>`;
  await writeText(fromRoot('sitemap.xml'),sitemap);
  await writeText(fromRoot('robots.txt'),`User-agent: *\nAllow: /\nDisallow: /generated/drafts/\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
  if(config.indexNowEnabled)await writeText(fromRoot(`${config.indexNowKey}.txt`),config.indexNowKey);
  return {articles:articles.length,paths:['blog/index.html','feed.xml','sitemap.xml','robots.txt',...(config.indexNowEnabled?[`${config.indexNowKey}.txt`]:[])]};
}
