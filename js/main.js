document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');
    if (!menuToggle || !menu) return;

    function closeMenu() {
        menu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
    }

    menuToggle.addEventListener('click', function () {
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menu.hidden = open;
        menuToggle.setAttribute('aria-expanded', String(!open));
        menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    });
    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', function (event) {
        if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
    });
});
