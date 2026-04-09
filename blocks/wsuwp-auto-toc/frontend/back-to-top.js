jQuery(document).ready(function ($) {

    // ======================
    // Back-to-Top
    // Only run on pages with Auto TOC
    // ======================

    (function initBackToTop() {
        if (!$('.wsuwp-auto-toc').length) return;

        var $topTarget = $('#wsuwp-auto-toc-top');
        if (!$topTarget.length) {
            $topTarget = $('<div>', { id: 'wsuwp-auto-toc-top', tabindex: -1 }).prependTo('body');
        }

        var $wrap = $('#wsuwp-auto-toc-back-to-top');
        var $link = $('#wsuwp-auto-toc-back-to-top-btn');

        var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var threshold = 300;

        function update() {
            var y = window.pageYOffset || document.documentElement.scrollTop || 0;
            var show = y > threshold;

            $wrap.toggleClass('is-visible', show)
                 .prop('hidden', !show)
                 .attr('aria-hidden', show ? 'false' : 'true');
        }

        $link.on('click', function (e) {
            var href = $(this).attr('href') || '';
            if (prefersReduced) return;
            if (href.charAt(0) !== '#') return;

            if ('scrollBehavior' in document.documentElement.style) {
                e.preventDefault();

                var focusTarget = document.querySelector('main h1, article h1, .entry-title, h1');
                if (focusTarget && !focusTarget.hasAttribute('tabindex')) {
                    focusTarget.setAttribute('tabindex', '-1');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (focusTarget && focusTarget.focus) {
                    window.setTimeout(function () {
                        focusTarget.focus({ preventScroll: true });
                    }, 300);
                }
            }
        });

        $(window).on('scroll', update);
        update();
    })();



});