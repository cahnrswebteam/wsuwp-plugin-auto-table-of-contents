import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';

registerBlockType('wsuwp/auto-toc', {
  title: 'Table of Contents',
  icon: 'list-view',
  category: 'common',
  attributes: {
    title: { type: 'string', default: 'Table of Contents' },
    maxLevel: { type: 'number', default: 4 },
    autoPopulateAnchors: { type: 'boolean', default: true },
    includeBackToTop: { type: 'boolean', default: true },
    backToTopText: { type: 'string', default: 'Back to top' },
    className: { type: 'string', default: 'wsuwp-auto-toc' },
  },

  edit: (props) => {
    const { attributes, setAttributes } = props;
    const blockProps = useBlockProps({ className: 'wsuwp-auto-toc__editor' });
    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const { blocks, selectedId, selectedBlock } = useSelect((select) => {
      const be = select('core/block-editor');
      const sid = be.getSelectedBlockClientId?.();
      return {
        blocks: be.getBlocks(),
        selectedId: sid,
        selectedBlock: sid ? be.getBlock(sid) : null,
      };
    }, []);

    const autoOwned = useRef(new Map());
    const userLocked = useRef(new Set());

    const rafId = useRef(0);
    const debounceId = useRef(0);
    const pendingById = useRef(new Map());

    const scheduleFlush = (delay = 180) => {
      if (debounceId.current) clearTimeout(debounceId.current);
      debounceId.current = setTimeout(() => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          const entries = Array.from(pendingById.current.entries());
          pendingById.current.clear();
          for (const [clientId, anchor] of entries) {
            updateBlockAttributes(clientId, { anchor });
            autoOwned.current.set(clientId, anchor);
          }
        });
      }, delay);
    };

    const plainText = (html) => {
      if (!html) return '';
      try {
        const div = document.createElement('div');
        div.innerHTML = String(html);
        return (div.textContent || '').trim();
      } catch {
        return String(html).trim();
      }
    };

    const slugify = (s) =>
      (s || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/[^a-z0-9\s-]/gi, '')
        .trim()
        .replace(/\s+/g, '-');

    useEffect(() => {
      if (!attributes.autoPopulateAnchors) return;
      if (!blocks?.length) return;

      const claimed = new Set();
      (function collect(bs) {
        bs.forEach((b) => {
          if (b.name === 'core/heading') {
            const a = (b.attributes?.anchor || '').trim();
            if (a) claimed.add(a);
          }
          if (b.innerBlocks?.length) collect(b.innerBlocks);
        });
      })(blocks);

      const ensureUnique = (base) => {
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
        bs.forEach((b) => {
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
    }, [
      blocks,
      selectedId,
      selectedBlock?.attributes?.content,
      attributes.autoPopulateAnchors,
    ]);

    const headings = useMemo(() => {
      const items = [];
      (function walk(bs) {
        bs.forEach((b) => {
          if (b.name === 'core/heading') {
            const level = b.attributes?.level || 2;
            if (level >= 2 && level <= (attributes.maxLevel || 4)) {
              const contentHtml = String(b.attributes?.content || '');
              const text = plainText(contentHtml);
              const anchor = (b.attributes?.anchor || '').trim();
              if (text) items.push({ level, text, html: contentHtml, anchor });
            }
          }
          if (b.innerBlocks?.length) walk(b.innerBlocks);
        });
      })(blocks || []);
      return items;
    }, [blocks, attributes.maxLevel]);

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title="Auto-TOC Settings" initialOpen>
            <TextControl
              label="Title"
              value={attributes.title}
              onChange={(v) => setAttributes({ title: v })}
            />
            <RangeControl
              label="Maximum heading level"
              value={attributes.maxLevel}
              onChange={(v) => setAttributes({ maxLevel: v })}
              min={2}
              max={6}
            />
            <ToggleControl
              label="Auto-populate & update heading anchors (editor)"
              checked={!!attributes.autoPopulateAnchors}
              onChange={(v) => setAttributes({ autoPopulateAnchors: v })}
            />
            <ToggleControl
              label="Show back to top button"
              checked={!!attributes.includeBackToTop}
              onChange={(v) => setAttributes({ includeBackToTop: v })}
            />
          </PanelBody>
        </InspectorControls>

        <div className="wsuwp-auto-toc__editor-preview">
          <h3>{attributes.title}</h3>
          {headings.length ? (
            <ul>
              {headings.map((h, i) => (
                <li key={i} style={{ marginLeft: (h.level - 2) * 12 }}>
                  <span dangerouslySetInnerHTML={{ __html: h.html || h.text }} />
                  {h.anchor && (
                    <code style={{ opacity: 0.6 }}>#{h.anchor}</code>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ opacity: 0.7 }}>No headings yet. Add H2–H6 blocks to see a preview.</p>
          )}
        </div>
      </div>
    );
  },

  save: () => null,
});