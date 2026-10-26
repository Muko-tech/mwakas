// Ets MWAKAS & FRÈRES — visionneuse photo et filtres des galeries
(function () {
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;
    var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));

    /* ---------- Filtres ---------- */
    var filters = document.querySelector('.gallery-filters');
    if (filters) {
        filters.addEventListener('click', function (e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            var f = btn.getAttribute('data-filter');
            filters.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b === btn); });
            imgs.forEach(function (img) { img.hidden = !(f === 'tout' || img.getAttribute('data-cat') === f); });
        });
    }

    /* ---------- Visionneuse ---------- */
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visionneuse de photos');
    lb.innerHTML =
        '<div class="lb-count"></div>' +
        '<button class="lb-btn lb-close" type="button" aria-label="Fermer"><i class="fas fa-xmark"></i></button>' +
        '<button class="lb-btn lb-prev" type="button" aria-label="Photo précédente"><i class="fas fa-chevron-left"></i></button>' +
        '<img alt="">' +
        '<button class="lb-btn lb-next" type="button" aria-label="Photo suivante"><i class="fas fa-chevron-right"></i></button>' +
        '<div class="lb-cap"></div>';
    document.body.appendChild(lb);
    var big = lb.querySelector('img'), count = lb.querySelector('.lb-count'), cap = lb.querySelector('.lb-cap');
    var list = [], pos = 0, lastFocus = null;

    function visible() { return imgs.filter(function (i) { return !i.hidden; }); }
    function caption(img) { return (img.alt || '').replace(/\s*–\s*Ets MWAKAS.*$/, ''); }
    function show(i) {
        pos = (i + list.length) % list.length;
        var img = list[pos];
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        count.textContent = (pos + 1) + ' / ' + list.length;
        cap.textContent = caption(img);
        [pos + 1, pos - 1].forEach(function (k) { var n = list[(k + list.length) % list.length]; if (n) { var p = new Image(); p.src = n.src; } });
    }
    function open(img) {
        list = visible(); lastFocus = document.activeElement;
        show(list.indexOf(img));
        lb.classList.add('open'); document.body.classList.add('lb-open');
        document.documentElement.style.overflow = 'hidden';
        lb.querySelector('.lb-close').focus();
    }
    function close() {
        lb.classList.remove('open'); document.body.classList.remove('lb-open');
        document.documentElement.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    imgs.forEach(function (img) {
        img.removeAttribute('onclick');
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.addEventListener('click', function () { open(img); });
        img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(pos - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(pos + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') show(pos + 1);
        if (e.key === 'ArrowLeft') show(pos - 1);
    });

    // Balayage au doigt
    var x0 = null, y0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(pos + (dx < 0 ? 1 : -1));
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
        x0 = y0 = null;
    });
})();
