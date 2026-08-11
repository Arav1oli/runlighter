document.documentElement.classList.add('js');

const openButton = document.querySelector('[data-nav-open]');
const closeButton = document.querySelector('[data-nav-close]');
const navigation = document.querySelector('[data-navigation]');

if (openButton && closeButton && navigation) {
  const openNavigation = () => {
    navigation.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.hidden = false;
    closeButton.focus();
  };

  const closeNavigation = () => {
    navigation.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    closeButton.hidden = true;
    openButton.focus();
  };

  const applyViewport = () => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    navigation.hidden = mobile;
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
