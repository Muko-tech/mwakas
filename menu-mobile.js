// Menu mobile Ets MWAKAS & FRÈRES
(function () {
    var btn = document.querySelector('.burger');
    var menu = document.getElementById('menu-mobile');
    var backdrop = document.querySelector('.menu-backdrop');
    function setOpen(open) {
        document.body.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        menu.setAttribute('aria-hidden', !open);
    }
    btn.addEventListener('click', function () { setOpen(!document.body.classList.contains('menu-open')); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 768) setOpen(false); });
})();
