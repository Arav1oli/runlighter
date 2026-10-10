const copy = {
  zh: {
    skip:'跳到正文',groupLabel:'集团介绍',navBrands:'旗下品牌',navContact:'联系我们',location:'Run Lighter 集团 · 澳大利亚悉尼',
    headline:'有愿景的品牌。<br><span>有支持的系统。</span>',intro:'Run Lighter 是 Asado Works 所属的品牌集团，拥有该品牌，并负责设计和管理支持其运营的业务系统。',meetBrands:'了解旗下品牌',
    mapParent:'品牌所有权 · 系统设计与管理',mapAsado:'家居用品采购与电子商务',mapNext:'新的家居用品方向',inDevelopment:'开发中',mapCaption:'各有特色，共享基础。',
    brandsEyebrow:'集团旗下品牌',brandsHeading:'不同的理念。<br>同样用心的支持。',asadoEyebrow:'由 Run Lighter 拥有和管理',asadoHeading:'烹饪、待客与日常生活。',
    asadoDescription:'Asado Works 采购和开发实用的家居用品。我们希望与重视实用设计、可靠品质和日常使用细节的制造商合作。',sales:'我们在亚马逊美国站销售产品。',visitAsado:'访问 Asado Works',supplierContact:'供应商咨询',grillAlt:'Asado Works 户外烹饪概念，目前正在开发中',grillCaption:'户外烹饪产品开发 · 概念示意图',
    nextEyebrow:'我们的新篇章 · 开发中',nextHeading:'一点意大利灵感。<br>一席温暖相聚。',nextDescription:'我们正在探索一个新的家居用品方向，灵感来自意大利文化、热情待客，以及在家分享日常美好时刻的乐趣。',nextPurpose:'我们的目标是开发实用的物品，帮助人们相聚、让客人感到受欢迎，同时适应现代住宅、有限空间和日常生活。',nextStatus:'品牌和产品系列仍在构思与开发中。',
    systemsEyebrow:'Run Lighter 的职责',systemsHeading:'品牌背后的<br>业务系统。',systemsDescription:'Run Lighter 设计和管理用于产品研究、采购、电子商务和日常协调的共享系统。各品牌拥有自己的定位和产品方向。',systemsLink:'了解 Run Lighter 的企业服务 ↗',researchTitle:'产品研究',researchDescription:'整理创意、客户需求和支持产品决策的相关资料。',sourcingTitle:'采购与协调',sourcingDescription:'将供应商信息、产品规格和后续沟通有序衔接。',commerceTitle:'网站与电子商务',commerceDescription:'设计品牌的线上展示和支持在线销售的工作流程。',operationsTitle:'业务系统',operationsDescription:'管理信息和可重复的流程，让工作持续推进。',
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
