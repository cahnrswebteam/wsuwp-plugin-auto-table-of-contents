/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/wsuwp-auto-toc/frontend/back-to-top.js"
/*!*******************************************************!*\
  !*** ./blocks/wsuwp-auto-toc/frontend/back-to-top.js ***!
  \*******************************************************/
() {

jQuery(document).ready(function ($) {
  // ======================
  // Back-to-Top
  // Only run on pages with Auto TOC
  // ======================

  (function initBackToTop() {
    if (!$('.wsuwp-auto-toc').length) return;
    var $topTarget = $('#wsuwp-auto-toc-top');
    if (!$topTarget.length) {
      $topTarget = $('<div>', {
        id: 'wsuwp-auto-toc-top',
        tabindex: -1
      }).prependTo('body');
    }
    var $wrap = $('#wsuwp-auto-toc-back-to-top');
    var $link = $('#wsuwp-auto-toc-back-to-top-btn');
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var threshold = 300;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var show = y > threshold;
      $wrap.toggleClass('is-visible', show).prop('hidden', !show).attr('aria-hidden', show ? 'false' : 'true');
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
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        if (focusTarget && focusTarget.focus) {
          window.setTimeout(function () {
            focusTarget.focus({
              preventScroll: true
            });
          }, 300);
        }
      }
    });
    $(window).on('scroll', update);
    update();
  })();
});

/***/ },

/***/ "./blocks/wsuwp-auto-toc/frontend/index.js"
/*!*************************************************!*\
  !*** ./blocks/wsuwp-auto-toc/frontend/index.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _back_to_top_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./back-to-top.js */ "./blocks/wsuwp-auto-toc/frontend/back-to-top.js");
/* harmony import */ var _back_to_top_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_back_to_top_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _toggle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toggle.js */ "./blocks/wsuwp-auto-toc/frontend/toggle.js");
/* harmony import */ var _toggle_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_toggle_js__WEBPACK_IMPORTED_MODULE_1__);



/***/ },

/***/ "./blocks/wsuwp-auto-toc/frontend/toggle.js"
/*!**************************************************!*\
  !*** ./blocks/wsuwp-auto-toc/frontend/toggle.js ***!
  \**************************************************/
() {

jQuery(document).ready(function ($) {
  // ======================
  // TOC list toggle
  // ======================

  (function () {
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
        setTimeout(function () {
          $list[0].style.maxHeight = '';
        }, 200);
      } else {
        $list[0].style.maxHeight = $list[0].scrollHeight + 'px';
        requestAnimationFrame(function () {
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
    $toggle.on('click', function () {
      var expanded = $toggle.attr('aria-expanded') === 'true';
      setExpanded(!expanded);
    });
    if (MQ.addEventListener) {
      MQ.addEventListener('change', initForViewport);
    } else if (MQ.addListener) {
      MQ.addListener(initForViewport);
    }
    initForViewport();
  })();
});

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./blocks/front-end.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_wsuwp_auto_toc_frontend_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/wsuwp-auto-toc/frontend/index.js */ "./blocks/wsuwp-auto-toc/frontend/index.js");

})();

/******/ })()
;
//# sourceMappingURL=front-end.js.map