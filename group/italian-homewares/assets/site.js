document.documentElement.classList.add('js');

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

function closeMenu() {
  if (!menuButton || !menu) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menu.classList.toggle('is-open', opening);
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = String(new Date().getFullYear());
});

