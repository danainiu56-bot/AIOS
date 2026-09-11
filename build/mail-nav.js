(() => {
  function removeMailNav() {
    document.querySelectorAll('[data-mail-mgt-nav]').forEach((item) => item.remove());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', removeMailNav);
  else removeMailNav();
})();
