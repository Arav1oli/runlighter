const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clarityProjectId = 'xxfpzxwf9h';
const analyticsPreferenceKey = 'runlighter_proposal_analytics_v1';
const recipientStorageKey = 'runlighter_solari_recipient_ref';
const sessionStorageKey = 'runlighter_solari_session_id';
const productionHost = /^(?:www\.)?runlighter\.com$/i.test(window.location.hostname);
const analyticsEvents = [];

const storage = {
  get(area, key) {
    try {
      return window[area].getItem(key);
    } catch {
      return null;
    }
  },
  set(area, key, value) {
    try {
      window[area].setItem(key, value);
    } catch {
      // The visitor may have disabled browser storage. The page remains usable.
    }
  }
};

const normaliseReference = (value) => {
  const candidate = String(value || '').trim().toLowerCase();
  if (candidate === 'internal') return candidate;
  return /^[a-z0-9][a-z0-9_-]{21,63}$/.test(candidate) ? candidate : '';
};

const recipientHash = window.location.hash.match(/^#(?:ref|view)=(internal|[a-z0-9][a-z0-9_-]{21,63})$/i);
if (recipientHash) {
  storage.set('sessionStorage', recipientStorageKey, normaliseReference(recipientHash[1]));
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

const recipientReference = normaliseReference(storage.get('sessionStorage', recipientStorageKey));
const internalVisit = recipientReference === 'internal';
const pageId = (() => {
  const path = window.location.pathname;
  if (path.includes('/role-coverage/')) return 'plan';
  if (path.includes('/evidence/')) return 'evidence';
  if (path.includes('/sources/')) return 'sources';
  return 'proposal';
})();

let analyticsChoice = internalVisit
  ? 'denied'
  : storage.get('sessionStorage', analyticsPreferenceKey);
let clarityStarted = false;

const createSessionId = () => {
  const existing = storage.get('sessionStorage', sessionStorageKey);
  if (existing) return existing;
  const value = window.crypto?.randomUUID?.() || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  storage.set('sessionStorage', sessionStorageKey, value);
  return value;
};

const clarityCommand = (...args) => {
  if (!productionHost || analyticsChoice !== 'granted') return;
  window.clarity?.(...args);
};

const trackEvent = (name) => {
  const eventName = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
  if (!eventName || analyticsChoice !== 'granted') return;
  analyticsEvents.push(eventName);
  clarityCommand('event', eventName);
};

const startAnalytics = () => {
  if (internalVisit || clarityStarted || analyticsChoice !== 'granted') return;
  clarityStarted = true;

  if (productionHost) {
    window.clarity = window.clarity || function clarityQueue() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    window.clarity('set', 'proposal', 'solari-stock-2026');
    window.clarity('set', 'proposal_page', pageId);
    window.clarity('set', 'proposal_access', recipientReference ? 'personalised' : 'direct');
    if (recipientReference && recipientReference !== 'internal') {
      window.clarity('identify', recipientReference, createSessionId(), `solari-stock-${pageId}`);
    }

    const script = document.createElement('script');
    script.async = true;
    script.dataset.clarityProject = clarityProjectId;
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`;
    document.head.appendChild(script);
  }

  trackEvent('proposal_open');
};

const withdrawAnalytics = () => {
  const reloadRequired = clarityStarted;
  if (productionHost && typeof window.clarity === 'function') {
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
  }
  clarityStarted = false;
  return reloadRequired;
};

const consentPanel = document.createElement('section');
consentPanel.className = 'analytics-consent';
consentPanel.setAttribute('role', 'dialog');
consentPanel.setAttribute('aria-label', 'Proposal analytics choice');
consentPanel.setAttribute('aria-live', 'polite');
consentPanel.innerHTML = `
  <p>This private proposal uses Microsoft Clarity session replay to measure pages viewed, scrolling, clicks and active time. Proposal text is masked. A recipient-specific link may associate a visit with its intended recipient, but does not prove who is using the device. <a href="/privacy/">Privacy details</a></p>
  <div class="analytics-consent__actions">
    <button type="button" data-analytics-deny>Continue without analytics</button>
    <button type="button" data-analytics-allow>Allow analytics</button>
  </div>`;
document.body.appendChild(consentPanel);

const showAnalyticsChoice = () => {
  consentPanel.classList.add('is-visible');
};

const hideAnalyticsChoice = () => consentPanel.classList.remove('is-visible');

consentPanel.querySelector('[data-analytics-allow]')?.addEventListener('click', () => {
  if (internalVisit) {
    hideAnalyticsChoice();
    return;
  }
  analyticsChoice = 'granted';
  storage.set('sessionStorage', analyticsPreferenceKey, analyticsChoice);
  hideAnalyticsChoice();
  startAnalytics();
  window.requestAnimationFrame(() => updateScroll());
});

consentPanel.querySelector('[data-analytics-deny]')?.addEventListener('click', () => {
  analyticsChoice = 'denied';
  storage.set('sessionStorage', analyticsPreferenceKey, analyticsChoice);
  if (withdrawAnalytics()) {
    window.location.reload();
  } else {
    hideAnalyticsChoice();
  }
});

document.querySelectorAll('[data-analytics-settings]').forEach((button) => {
  if (internalVisit) {
    button.hidden = true;
  } else {
    button.addEventListener('click', showAnalyticsChoice);
  }
});

if (analyticsChoice === 'granted') {
  startAnalytics();
} else if (analyticsChoice !== 'denied') {
  showAnalyticsChoice();
}

window.__proposalAnalytics = {
  get choice() { return analyticsChoice; },
  events: analyticsEvents,
  pageId,
  recipientReference,
  productionHost
};

const progressBar = document.querySelector('.scroll-progress span');
const scrollMilestones = [25, 50, 75, 90];
const reachedMilestones = new Set();
let scrollFrame = 0;

const updateScroll = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
  if (analyticsChoice === 'granted') {
    scrollMilestones.forEach((milestone) => {
      if (ratio * 100 >= milestone && !reachedMilestones.has(milestone)) {
        reachedMilestones.add(milestone);
        trackEvent(`scroll_${milestone}`);
      }
    });
  }
  scrollFrame = 0;
};

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

document.querySelectorAll('.table-region table').forEach((table) => {
  const labels = Array.from(table.querySelectorAll('thead th')).map((heading) => heading.textContent.trim());
  table.querySelectorAll('tbody tr').forEach((row) => {
    Array.from(row.children).forEach((cell, index) => {
      if (labels[index]) cell.dataset.label = labels[index];
    });
  });
  table.closest('.table-region')?.classList.add('is-stacked');
});

const eventSlug = (value) => String(value || '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .slice(0, 48);

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    const label = detail.querySelector('.disclosure-title, .action-title, summary strong, summary')?.textContent;
    trackEvent(`disclosure_open_${eventSlug(label)}`);
    if (!reducedMotion) {
      detail.querySelector('.disclosure-body, .evidence-image-link, .source-links')?.animate(
        [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
  });
});

document.addEventListener('click', (event) => {
  const target = event.target.closest('a, button[data-track]');
  if (!target) return;
  let eventName = target.dataset.track || '';
  const href = target.getAttribute('href') || '';
  if (!eventName && href.includes('Solari_and_Stock_Marketing_Implementation_Proposal.pdf')) eventName = 'pdf_download';
  if (!eventName && target.closest('.site-nav')) eventName = `nav_${eventSlug(target.textContent)}`;
  if (!eventName && target.closest('.runlighter-links')) eventName = `runlighter_${eventSlug(target.textContent)}`;
  if (!eventName && target.closest('.footer-secondary')) eventName = `footer_${eventSlug(target.textContent)}`;
  if (!eventName && target.closest('.evidence-image-link')) {
    const label = target.closest('.evidence-item')?.querySelector('.disclosure-title')?.textContent || 'image';
    eventName = `evidence_image_${eventSlug(label)}`;
  }
  if (!eventName && target.closest('.source-links')) eventName = `source_${eventSlug(target.textContent)}`;
  if (!eventName && target.classList.contains('return-link')) eventName = 'nav_return_to_proposal';
  if (eventName) trackEvent(eventName);
});

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.proposal-cover__grid, .page-hero-grid, .supporting-hero-grid, .content-section > .shell, .delivery-intro > .shell, .responsibility-panel > .shell, .return-row > .shell'
  );
  revealTargets.forEach((target) => target.classList.add('reveal-group'));
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -2% 0px', threshold: 0.01 });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

const investment = document.querySelector('#current-arrangements');
const costLinks = document.querySelectorAll('[data-cost-link]');
if (investment && costLinks.length && 'IntersectionObserver' in window) {
  const costObserver = new IntersectionObserver(
    ([entry]) => costLinks.forEach((link) => link.classList.toggle('is-section-active', entry.isIntersecting)),
    { threshold: 0.15 }
  );
  costObserver.observe(investment);
}

const alignHashTarget = () => {
  if (!window.location.hash) return;
  const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  target?.scrollIntoView({ block: 'start', behavior: 'auto' });
};

const scheduleHashAlignment = () => {
  [40, 260].forEach((delay) => window.setTimeout(alignHashTarget, delay));
};

if (window.location.hash) scheduleHashAlignment();
window.addEventListener('hashchange', scheduleHashAlignment);

let lastInteractionAt = Date.now();
let activeSeconds = 0;
const activeMilestones = [30, 60, 120, 300];
const reachedActiveMilestones = new Set();
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((name) => {
  window.addEventListener(name, () => { lastInteractionAt = Date.now(); }, { passive: true });
});

window.setInterval(() => {
  if (analyticsChoice !== 'granted' || document.visibilityState !== 'visible' || Date.now() - lastInteractionAt > 30000) return;
  activeSeconds += 1;
  activeMilestones.forEach((milestone) => {
    if (activeSeconds >= milestone && !reachedActiveMilestones.has(milestone)) {
      reachedActiveMilestones.add(milestone);
      trackEvent(`active_${milestone}s`);
    }
  });
}, 1000);
