jQuery(document).ready(function ($) {

    // ======================
    // TOC list toggle
    // ======================

    (function() {
        var $toggle = $('.wsuwp-auto-toc-toggle').first();
        var $list = $('#wsuwp-auto-toc-list');
        if (!$toggle.length || !$list.length) return;

        var LABEL_SHOW = 'Show';
        var LABEL_HIDE = 'Hide';
        var MQ = window.matchMedia('(max-width: 768px)');

        var $label = $toggle.find('.wsuwp-auto-toc-toggle__label');
        var $icon = $toggle.find('.wsuwp-auto-toc-toggle__icon');

        function setExpanded(expanded) {
            $toggle.attr('aria-expanded', expanded ? 'true' : 'false');
            if (expanded) {
                $list.removeClass('is-collapsed');
                $label.text(LABEL_HIDE);
                $icon.css('transform', 'rotate(0deg)');
                $list[0].style.maxHeight = $list[0].scrollHeight + 'px';
                setTimeout(function() { $list[0].style.maxHeight = ''; }, 200);
            } else {
                $list[0].style.maxHeight = $list[0].scrollHeight + 'px';
                requestAnimationFrame(function() {
                    $list.addClass('is-collapsed');
                    $list[0].style.maxHeight = '0px';
                });
                $label.text(LABEL_SHOW);
                $icon.css('transform', 'rotate(-90deg)');
            }
        }

        function initForViewport() {
            if (MQ.matches) {
                setExpanded(false);
            } else {
                $list.removeClass('is-collapsed');
                $list[0].style.maxHeight = '';
                $toggle.attr('aria-expanded', 'true');
                $label.text(LABEL_HIDE);
                $icon.css('transform', 'rotate(0deg)');
            }
        }

        $toggle.on('click', function() {
            var expanded = $toggle.attr('aria-expanded') === 'true';
            setExpanded(!expanded);
        });

        if (MQ.addEventListener) { MQ.addEventListener('change', initForViewport); }
        else if (MQ.addListener) { MQ.addListener(initForViewport); }

        initForViewport();
    })();

});