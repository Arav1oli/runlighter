const header = document.querySelector('[data-site-header]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let anchorHeaderLockUntil = 0;

if (header) {
  const brand = header.querySelector('.header-brand');
  const navigation = header.querySelector('.navigation-row');
  const progressBar = header.querySelector('.scroll-progress span');
  let previousY = window.scrollY;
  let accumulated = 0;
  let frame = 0;
  let keyboardInside = false;

  const measureHeader = () => {
    document.documentElement.style.setProperty('--full-header-height', `${header.offsetHeight}px`);
    const headerTop = header.getBoundingClientRect().top;
    const navigationTop = navigation?.getBoundingClientRect().top || headerTop;
    document.documentElement.style.setProperty('--brand-height', `${Math.max(0, navigationTop - headerTop - 8)}px`);
  };

  const setState = (state) => {
    if (header.dataset.headerState !== state) {
      header.dataset.headerState = state;
    }
  };

  const updateHeader = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(1, Math.max(0, currentY / available)) : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    if (currentY < 20) {
      accumulated = 0;
      setState('top');
    } else if (Date.now() < anchorHeaderLockUntil) {
      accumulated = 0;
      setState('compact');
    } else if (keyboardInside) {
      accumulated = 0;
      setState('compact');
    } else if (Math.sign(delta) !== Math.sign(accumulated) && Math.abs(delta) > 1) {
      accumulated = delta;
    } else {
      accumulated += delta;
    }

    if (currentY >= 20 && !keyboardInside) {
      if (accumulated > 14 && currentY > header.offsetHeight) {
        setState('hidden');
        accumulated = 0;
      } else if (accumulated < -10) {
        setState('compact');
        accumulated = 0;
      }
    }

    previousY = currentY;
    frame = 0;
  };

  const requestHeaderUpdate = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(updateHeader);
    }
  };

  header.addEventListener('focusin', () => {
    keyboardInside = true;
    setState(window.scrollY < 20 ? 'top' : 'compact');
  });

  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) {
      keyboardInside = false;
    }
  });

  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  window.addEventListener('resize', () => {
    measureHeader();
    requestHeaderUpdate();
  });

  measureHeader();
  updateHeader();
}

document.querySelectorAll('.table-region table').forEach((table) => {
  const labels = Array.from(table.querySelectorAll('thead th')).map((heading) => heading.textContent.trim());

  table.querySelectorAll('tbody tr').forEach((row) => {
    Array.from(row.children).forEach((cell, index) => {
      if (labels[index]) {
        cell.dataset.label = labels[index];
      }
    });
  });

  table.closest('.table-region')?.classList.add('is-stacked');
});

document.querySelectorAll('details').forEach((detail) => {
  const summary = detail.querySelector('summary');

  summary?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      detail.open = !detail.open;
    }
  });

  detail.addEventListener('toggle', () => {
    if (detail.open && !reducedMotion) {
      detail.querySelector('.disclosure-body, .evidence-image-link, .source-links')?.animate(
        [
          { opacity: 0, transform: 'translateY(-6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
  });
});

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.proposal-cover__grid, .page-hero-grid, .supporting-hero-grid, .content-section > .shell, .delivery-intro > .shell, .responsibility-panel > .shell, .return-row > .shell'
  );

  revealTargets.forEach((target) => target.classList.add('reveal-group'));
  document.documentElement.classList.add('motion-ready');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -2% 0px', threshold: 0.01 }
  );

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
  if (header && window.scrollY > 20) {
    anchorHeaderLockUntil = Date.now() + 1200;
    window.setTimeout(() => {
      header.dataset.headerState = 'compact';
    }, 80);
  }
};

const scheduleHashAlignment = () => {
  [40, 260, 700].forEach((delay) => window.setTimeout(alignHashTarget, delay));
};

if (window.location.hash) {
  scheduleHashAlignment();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', scheduleHashAlignment, { once: true });
  }
}

window.addEventListener('hashchange', scheduleHashAlignment);
