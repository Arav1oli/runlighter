const copy = {
  zh: {
    skip:'跳到正文',groupLabel:'Run Lighter 集团',navBrands:'旗下品牌',navContact:'联系我们',location:'Run Lighter 集团 · 澳大利亚悉尼',
    headline:'有愿景的品牌。<br><span>有支持的系统。</span>',intro:'Run Lighter 集团拥有 Asado Works、Run Lighter 和 Si Torna 三个品牌。Run Lighter 负责设计和管理支持集团旗下品牌的业务系统。',meetBrands:'了解旗下品牌',
    mapGroupName:'Run Lighter 集团',mapParent:'品牌所有权 · 共同方向',mapAsado:'家居用品采购与电子商务',mapRunLighter:'业务系统与企业服务',mapNext:'Si Torna',inDevelopment:'开发中',mapCaption:'各有特色，共享基础。',
    brandsEyebrow:'集团旗下品牌',brandsHeading:'不同的理念。<br>同样用心的支持。',asadoEyebrow:'Run Lighter 集团旗下品牌',asadoHeading:'烹饪、待客与日常生活。',
    asadoDescription:'Asado Works 采购和开发实用的家居用品。我们希望与重视实用设计、可靠品质和日常使用细节的制造商合作。',sales:'我们在亚马逊美国站销售产品。',visitAsado:'访问 Asado Works',supplierContact:'供应商咨询',grillAlt:'Asado Works 户外烹饪概念，目前正在开发中',grillCaption:'户外烹饪产品开发 · 概念示意图',
    nextEyebrow:'Run Lighter 集团旗下品牌 · 开发中',nextHeading:'Si Torna。<br>更接近我们的来处。',nextDescription:'Si Torna 是一个家居用品品牌，灵感来自意大利的文化传承，以及亲手制作、分享与相聚带来的熟悉喜悦。品牌从日常仪式出发，让我们与自己的文化根源重新连接。',nextPurpose:'为揉面时的双手、餐桌上的相聚和家中的片刻安宁设计实用的物品，让代代相传的习惯融入现代日常生活。',visitSiTorna:'访问 Si Torna',nextStatus:'首个产品系列正在开发中。目前展示的是设计构想，成品尚未上市。',
    systemsEyebrow:'Run Lighter 集团旗下品牌',systemsHeading:'Run Lighter。<br>品牌背后的业务系统。',systemsDescription:'Run Lighter 是集团旗下的业务系统与企业服务品牌，负责设计和管理用于产品研究、采购、电子商务和日常协调的共享系统。',systemsLink:'了解 Run Lighter 的企业服务 ↗',researchTitle:'产品研究',researchDescription:'整理创意、客户需求和支持产品决策的相关资料。',sourcingTitle:'采购与协调',sourcingDescription:'将供应商信息、产品规格和后续沟通有序衔接。',commerceTitle:'网站与电子商务',commerceDescription:'设计品牌的线上展示和支持在线销售的工作流程。',operationsTitle:'业务系统',operationsDescription:'管理信息和可重复的流程，让工作持续推进。',
    contactEyebrow:'面向家居用品制造商与供应商',contactHeading:'好产品，<br>从一句你好开始。',contactIntro:'如果您生产设计用心、实用的家居用品，我们期待了解您的产品系列和制造能力。',contactLocation:'Asado Works · 澳大利亚悉尼',copyEmail:'复制电子邮箱',footerLocation:'澳大利亚悉尼',footerServices:'Run Lighter 企业服务',privacy:'隐私政策'
  }
};
const originals = new Map();
document.querySelectorAll('[data-i18n]').forEach(el => originals.set(el, el.innerHTML));
const altOriginals = new Map();
document.querySelectorAll('[data-i18n-alt]').forEach(el => altOriginals.set(el, el.alt));
let language = 'en';
function setLanguage(next) {
  language = next === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = language === 'zh' ? 'zh-Hans' : 'en-AU';
  originals.forEach((original, el) => {el.innerHTML = language === 'zh' ? (copy.zh[el.dataset.i18n] ?? original) : original;});
  altOriginals.forEach((original, el) => {el.alt = language === 'zh' ? (copy.zh[el.dataset.i18nAlt] ?? original) : original;});
  document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.language === language)));
  document.getElementById('copy-feedback').textContent = '';
  try { localStorage.setItem('runlighter-group-language', language); } catch {}
}
document.querySelectorAll('[data-language]').forEach(el => el.addEventListener('click',() => setLanguage(el.dataset.language)));
try { setLanguage(localStorage.getItem('runlighter-group-language') || 'en'); } catch {}
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('copy-email').addEventListener('click',async () => {
  const feedback = document.getElementById('copy-feedback');
  try {
    await navigator.clipboard.writeText('adrian@asadoworks.com');
    feedback.textContent = language === 'zh' ? '已复制：adrian@asadoworks.com' : 'Copied: adrian@asadoworks.com';
  } catch {
    feedback.textContent = language === 'zh' ? '请选中并复制上方的邮箱地址。' : 'Select and copy the email address above.';
  }
});
