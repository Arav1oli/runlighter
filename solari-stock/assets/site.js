document.documentElement.classList.add('js');

const openButton = document.querySelector('[data-nav-open]');
const closeButton = document.querySelector('[data-nav-close]');
const navigation = document.querySelector('[data-navigation]');

if (openButton && closeButton && navigation) {
  const openNavigation = () => {
    navigation.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    openButton.hidden = true;
    closeButton.hidden = false;
    closeButton.focus();
  };

  const closeNavigation = () => {
    navigation.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.hidden = false;
    closeButton.hidden = true;
    openButton.focus();
  };

  const applyViewport = () => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    navigation.hidden = mobile;
    openButton.hidden = false;
    closeButton.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
  };

  openButton.addEventListener('click', openNavigation);
  closeButton.addEventListener('click', closeNavigation);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !navigation.hidden) {
      closeNavigation();
    }
  });

  window.addEventListener('resize', applyViewport);
  applyViewport();
}

const header = document.querySelector('.site-header');

if (header) {
  const progress = document.createElement('div');
  const progressBar = document.createElement('span');
  let scrollFrame = 0;

  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.append(progressBar);
  header.append(progress);

  const updateScrollState = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    scrollFrame = 0;
  };

  const requestScrollUpdate = () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateScrollState);
    }
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateScrollState();
}

document.querySelectorAll('.table-region table').forEach((table) => {
  const labels = Array.from(table.querySelectorAll('thead th')).map((heading) => heading.textContent.trim());
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    Array.from(row.children).forEach((cell, index) => {
      if (labels[index]) {
        cell.dataset.label = labels[index];
      }
    });
  });

  table.closest('.table-region')?.classList.add('is-stacked');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion && 'IntersectionObserver' in window) {
  const staggerGroups = document.querySelectorAll('.cards, .service-list, .evidence-gallery');
  const revealGroups = document.querySelectorAll(
    '.section-heading, .delivery-intro > .shell, .callout-band > .shell, .table-region, .text-stack, .workflow-line'
  );

  staggerGroups.forEach((group) => group.classList.add('reveal-stagger'));
  revealGroups.forEach((group) => {
    if (!group.classList.contains('reveal-stagger')) {
      group.classList.add('reveal-group');
    }
  });

  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  document.querySelectorAll('.reveal-group, .reveal-stagger').forEach((element) => observer.observe(element));
}
