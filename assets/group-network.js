(() => {
  const menu = document.getElementById('mobileMenu');
  const nav = document.querySelector('.nav');
  if (!menu || !nav) return;
  const position = () => {
    if (!menu.hidden) menu.style.setProperty('--mobile-menu-top', `${nav.getBoundingClientRect().bottom + 8}px`);
  };
  document.querySelectorAll('.menu-button, .spine-burger').forEach(button => button.addEventListener('click', position));
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, { passive: true });
})();
