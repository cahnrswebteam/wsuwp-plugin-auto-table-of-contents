/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/wsuwp-auto-toc/editor/block.js"
/*!***********************************************!*\
  !*** ./blocks/wsuwp-auto-toc/editor/block.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('wsuwp/auto-toc', {
  title: 'Table of Contents',
  icon: 'list-view',
  category: 'common',
  attributes: {
    title: {
      type: 'string',
      default: 'Table of Contents'
    },
    maxLevel: {
      type: 'number',
      default: 4
    },
    autoPopulateAnchors: {
      type: 'boolean',
      default: true
    },
    includeBackToTop: {
      type: 'boolean',
      default: true
    },
    backToTopText: {
      type: 'string',
      default: 'Back to top'
    },
    className: {
      type: 'string',
      default: 'wsuwp-auto-toc'
    }
  },
  edit: props => {
    const {
      attributes,
      setAttributes
    } = props;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'wsuwp-auto-toc__editor'
    });
    const {
      updateBlockAttributes
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('core/block-editor');
    const {
      blocks,
      selectedId,
      selectedBlock
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
      const be = select('core/block-editor');
      const sid = be.getSelectedBlockClientId?.();
      return {
        blocks: be.getBlocks(),
        selectedId: sid,
        selectedBlock: sid ? be.getBlock(sid) : null
      };
    }, []);
    const autoOwned = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(new Map());
    const userLocked = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(new Set());
    const rafId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(0);
    const debounceId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(0);
    const pendingById = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(new Map());
    const scheduleFlush = (delay = 180) => {
      if (debounceId.current) clearTimeout(debounceId.current);
      debounceId.current = setTimeout(() => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          const entries = Array.from(pendingById.current.entries());
          pendingById.current.clear();
          for (const [clientId, anchor] of entries) {
            updateBlockAttributes(clientId, {
              anchor
            });
            autoOwned.current.set(clientId, anchor);
          }
        });
      }, delay);
    };
    const plainText = html => {
      if (!html) return '';
      try {
        const div = document.createElement('div');
        div.innerHTML = String(html);
        return (div.textContent || '').trim();
      } catch {
        return String(html).trim();
      }
    };
    const slugify = s => (s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-');
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
      if (!attributes.autoPopulateAnchors) return;
      if (!blocks?.length) return;
      const claimed = new Set();
      (function collect(bs) {
        bs.forEach(b => {
          if (b.name === 'core/heading') {
            const a = (b.attributes?.anchor || '').trim();
            if (a) claimed.add(a);
          }
          if (b.innerBlocks?.length) collect(b.innerBlocks);
        });
      })(blocks);
      const ensureUnique = base => {
        if (!base) return '';
        if (!claimed.has(base)) {
          claimed.add(base);
          return base;
        }
        let n = 2;
        while (claimed.has(`${base}-${n}`)) n++;
        const u = `${base}-${n}`;
        claimed.add(u);
        return u;
      };
      const queueUpdate = (clientId, next) => {
        const prev = pendingById.current.get(clientId);
        if (prev === next) return;
        pendingById.current.set(clientId, next);
      };
      (function walk(bs) {
        bs.forEach(b => {
          if (b.name !== 'core/heading') {
            if (b.innerBlocks?.length) walk(b.innerBlocks);
            return;
          }
          const text = plainText(b.attributes?.content || '');
          const currentAnchor = (b.attributes?.anchor || '').trim();
          const lastAuto = autoOwned.current.get(b.clientId);
          const isFallback = /^section(\-\d+)?$/.test(currentAnchor);
          if (lastAuto && currentAnchor && currentAnchor !== lastAuto) {
            autoOwned.current.delete(b.clientId);
            userLocked.current.add(b.clientId);
          }
          if (!currentAnchor && userLocked.current.has(b.clientId)) {
            userLocked.current.delete(b.clientId);
          }
          const locked = userLocked.current.has(b.clientId);
          const shouldManage = !locked && (!currentAnchor || lastAuto || isFallback);
          if (!shouldManage) return;
          if (!text) return;
          if (currentAnchor) claimed.delete(currentAnchor);
          const base = slugify(text);
          if (!base) return;
          const next = ensureUnique(base);
          if (next && next !== currentAnchor) {
            queueUpdate(b.clientId, next);
          }
        });
      })(blocks);
      if (pendingById.current.size) scheduleFlush(180);
    }, [blocks, selectedId, selectedBlock?.attributes?.content, attributes.autoPopulateAnchors]);
    const headings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
      const items = [];
      (function walk(bs) {
        bs.forEach(b => {
          if (b.name === 'core/heading') {
            const level = b.attributes?.level || 2;
            if (level >= 2 && level <= (attributes.maxLevel || 4)) {
              const contentHtml = String(b.attributes?.content || '');
              const text = plainText(contentHtml);
              const anchor = (b.attributes?.anchor || '').trim();
              if (text) items.push({
                level,
                text,
                html: contentHtml,
                anchor
              });
            }
          }
          if (b.innerBlocks?.length) walk(b.innerBlocks);
        });
      })(blocks || []);
      return items;
    }, [blocks, attributes.maxLevel]);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: "Auto-TOC Settings",
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: "Title",
            value: attributes.title,
            onChange: v => setAttributes({
              title: v
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: "Maximum heading level",
            value: attributes.maxLevel,
            onChange: v => setAttributes({
              maxLevel: v
            }),
            min: 2,
            max: 6
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: "Auto-populate & update heading anchors (editor)",
            checked: !!attributes.autoPopulateAnchors,
            onChange: v => setAttributes({
              autoPopulateAnchors: v
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: "Show back to top button",
            checked: !!attributes.includeBackToTop,
            onChange: v => setAttributes({
              includeBackToTop: v
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "wsuwp-auto-toc__editor-preview",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
          children: attributes.title
        }), headings.length ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("ul", {
          children: headings.map((h, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("li", {
            style: {
              marginLeft: (h.level - 2) * 12
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              dangerouslySetInnerHTML: {
                __html: h.html || h.text
              }
            }), h.anchor && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("code", {
              style: {
                opacity: 0.6
              },
              children: ["#", h.anchor]
            })]
          }, i))
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            opacity: 0.7
          },
          children: "No headings yet. Add H2\u2013H6 blocks to see a preview."
        })]
      })]
    });
  },
  save: () => null
});

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./blocks/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_wsuwp_auto_toc_editor_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/wsuwp-auto-toc/editor/block */ "./blocks/wsuwp-auto-toc/editor/block.js");

})();

/******/ })()
;
//# sourceMappingURL=index.js.map