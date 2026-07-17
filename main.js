/* =========================================================
   HAVE｜共通スクリプト
   1. ハンバーガーメニュー（ドロワー）の開閉
   2. スクロールでヘッダーの背景を出す
   3. スクロールで要素をふわっと表示（reveal）
   4. フッターの西暦を自動表示
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ===== 1. ドロワーメニューの開閉 ===== */
    (function () {
        var body     = document.body;
        var toggle   = document.getElementById('menuToggle');
        var closeBtn = document.getElementById('drawerClose');
        var overlay  = document.getElementById('drawerOverlay');
        var drawer   = document.getElementById('drawer');

        // 部品がそろっていないページでは何もしない
        if (!toggle || !drawer) return;

        function openMenu() {
            body.classList.add('menu-open');
            toggle.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
        }
        function closeMenu() {
            body.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
        }
        function toggleMenu() {
            if (body.classList.contains('menu-open')) { closeMenu(); }
            else { openMenu(); }
        }

        toggle.addEventListener('click', toggleMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay)  overlay.addEventListener('click', closeMenu);

        // メニュー内のリンクを押したら閉じる
        var links = drawer.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        // Escキーで閉じる
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { closeMenu(); }
        });
    })();


    /* ===== 2. スクロールでヘッダーに背景を出す ===== */
    (function () {
        var header = document.querySelector('.site-header');
        if (!header) return;

        function onScroll() {
            if (window.scrollY > 40) { header.classList.add('is-scrolled'); }
            else { header.classList.remove('is-scrolled'); }
        }
        onScroll();                               // 読み込み時にも判定
        window.addEventListener('scroll', onScroll, { passive: true });
    })();


    /* ===== 3. スクロールで要素をふわっと表示 ===== */
    (function () {
        var targets = document.querySelectorAll('.reveal, .reveal-stagger');
        if (!targets.length) return;

        // 古いブラウザ対策：非対応なら最初から表示
        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < targets.length; i++) {
                targets[i].classList.add('is-visible');
            }
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);   // 一度出したら監視終了
                }
            });
        }, { threshold: 0.14 });

        for (var j = 0; j < targets.length; j++) {
            observer.observe(targets[j]);
        }
    })();


    /* ===== 4. フッターの西暦を自動更新 ===== */
    (function () {
        var el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    })();


    /* ===== 5. ヒーローのロゴをスクロールでゆっくり視差移動 ===== */
    (function () {
        var wrap = document.querySelector('.hero-logo-wrap');
        if (!wrap) return;

        // 「動きを控えたい」設定なら視差はかけない
        if (window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var ticking = false;

        function update() {
            var y = window.scrollY;
            // ごく控えめに：下へ少しだけ沈み、スクロールに合わせてそっと消える
            wrap.style.transform = 'translateY(' + (y * 0.18) + 'px)';
            wrap.style.opacity = Math.max(0, 1 - y / 600);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    })();

});
