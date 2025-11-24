document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileResourcesBtn = document.getElementById('mobile-resources-btn');
  const mobileResourcesMenu = document.getElementById('mobile-resources-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });
  }

  if (mobileResourcesBtn && mobileResourcesMenu) {
    mobileResourcesBtn.addEventListener('click', function () {
      mobileResourcesMenu.classList.toggle('hidden');
    });
  }
});



