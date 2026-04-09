<?php namespace WSUWP\Plugin\AutoTableOfContents;

class Block_WSUWP_Auto_TOC extends \WSUWP\Plugin\Gutenberg\Block {

	protected static $block_name = 'wsuwp/auto-toc';

	protected static $default_attrs = array(
		'title'             => 'Table of Contents',
		'minLevel'          => 2,
		'maxLevel'          => 4,
		'includeBackToTop'  => true,
		'minHeadings'       => 1,
		'className'         => 'wsuwp-auto-toc',
	);

	public static function render( $attrs, $content = '' ) {
		global $post;
		if ( ! $post ) return '';

		$min = isset( $attrs['minLevel'] ) ? max( 1, min( 6, (int) $attrs['minLevel'] ) ) : 2;
		$max = isset( $attrs['maxLevel'] ) ? max( 1, min( 6, (int) $attrs['maxLevel'] ) ) : 4;
		$max = max( $min, $max );

		$blocks   = parse_blocks( $post->post_content );
		$headings = self::collect_headings_unique( $blocks, $min, $max );

		if ( count( $headings ) < (int) $attrs['minHeadings'] ) return '';

		$title            = sanitize_text_field( $attrs['title'] );
		$includeBackToTop = ! empty( $attrs['includeBackToTop'] );
		$className        = isset( $attrs['className'] ) ? $attrs['className'] : 'wsuwp-auto-toc';

		ob_start();
		include __DIR__ . '/template.php';
		return ob_get_clean();
	}

	protected static function collect_headings_unique( $blocks, $min, $max ) {
		$items = array();
		$used  = array();

		$walk = function( $bs ) use ( &$items, &$used, $min, $max, &$walk ) {
			foreach ( $bs as $block ) {
				if ( isset( $block['blockName'] ) && 'core/heading' === $block['blockName'] ) {
					$level = isset( $block['attrs']['level'] ) ? (int) $block['attrs']['level'] : 2;
					if ( $level >= $min && $level <= $max ) {

						$inner_html   = isset( $block['innerHTML'] ) ? (string) $block['innerHTML'] : '';
						$content_attr = isset( $block['attrs']['content'] ) ? (string) $block['attrs']['content'] : '';

						$visible_html = $content_attr !== '' ? $content_attr : $inner_html;

						$text = wp_strip_all_tags( html_entity_decode( $visible_html !== '' ? $visible_html : $inner_html ) );
						$text = trim( $text );

						$html_id = '';
						if ( $inner_html !== '' ) {
							if ( preg_match( '/<h[1-6][^>]*\sid=["\']([^"\']+)["\']/i', $inner_html, $m ) ) {
								$html_id = trim( (string) $m[1] );
							}
						}
						$anchor_attr = isset( $block['attrs']['anchor'] ) ? trim( (string) $block['attrs']['anchor'] ) : '';

						$base = $html_id !== '' ? $html_id : ( $anchor_attr !== '' ? $anchor_attr : $text );

						$final = self::unique_anchor( $base, $used );

						if ( $text !== '' ) {
							$items[] = array(
								'level'  => $level,
								'text'   => $text,
								'html'   => $visible_html,
								'anchor' => $final,
							);
						}
					}
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$walk( $block['innerBlocks'] );
				}
			}
		};

		$walk( $blocks );
		return $items;
	}

	protected static function unique_anchor( $base, array &$used ) {
		$base = sanitize_title( (string) $base );
		if ( $base === '' ) $base = 'section';
		if ( empty( $used[ $base ] ) ) {
			$used[ $base ] = 1;
			return $base;
		}
		$used[ $base ]++;
		return $base . '-' . $used[ $base ];
	}
}