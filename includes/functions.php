<?php namespace WSUWP\Plugin\AutoTableOfContents;

class WSUWP_Auto_Table_Of_Contents_Functions {
	public static function init() {
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'wsuwp_enqueue_block_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'wsuwp_enqueue_frontend_assets' ), 5 );
		add_action( 'wp_footer', array( __CLASS__, 'output_back_to_top_button' ) );
	}

	public static function has_auto_toc_block() {
		if ( ! is_singular() ) {
			return false;
		}

		$post = get_queried_object();

		if ( ! $post || empty( $post->post_content ) ) {
			return false;
		}

		return has_block( 'wsuwp/auto-toc', $post );
	}

	public static function has_auto_toc_block_with_back_to_top() {
		if ( ! is_singular() ) {
			return false;
		}

		$post = get_queried_object();

		if ( ! $post || empty( $post->post_content ) ) {
			return false;
		}

		$blocks = parse_blocks( $post->post_content );
		$has_enabled = false;

		$walk = function( $blocks ) use ( &$walk, &$has_enabled ) {
			foreach ( $blocks as $block ) {
				if ( ! empty( $block['blockName'] ) && 'wsuwp/auto-toc' === $block['blockName'] ) {
					$include_back_to_top = true;

					if ( isset( $block['attrs']['includeBackToTop'] ) ) {
						$include_back_to_top = ! empty( $block['attrs']['includeBackToTop'] );
					}

					if ( $include_back_to_top ) {
						$has_enabled = true;
						return;
					}
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$walk( $block['innerBlocks'] );
					if ( $has_enabled ) {
						return;
					}
				}
			}
		};

		$walk( $blocks );

		return $has_enabled;
	}

	public static function get_back_to_top_text() {
		if ( ! is_singular() ) {
			return __( 'Back to top', 'wsuwp-plugin-auto-table-of-contents' );
		}

		$post = get_queried_object();

		if ( ! $post || empty( $post->post_content ) ) {
			return __( 'Back to top', 'wsuwp-plugin-auto-table-of-contents' );
		}

		$blocks = parse_blocks( $post->post_content );
		$text = __( 'Back to top', 'wsuwp-plugin-auto-table-of-contents' );

		$walk = function( $blocks ) use ( &$walk, &$text ) {
			foreach ( $blocks as $block ) {
				if ( ! empty( $block['blockName'] ) && 'wsuwp/auto-toc' === $block['blockName'] ) {
					$include_back_to_top = true;

					if ( isset( $block['attrs']['includeBackToTop'] ) ) {
						$include_back_to_top = ! empty( $block['attrs']['includeBackToTop'] );
					}

					if ( $include_back_to_top ) {
						if ( ! empty( $block['attrs']['backToTopText'] ) ) {
							$text = sanitize_text_field( $block['attrs']['backToTopText'] );
						}
						return;
					}
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$walk( $block['innerBlocks'] );
				}
			}
		};

		$walk( $blocks );

		return $text;
	}

	public static function wsuwp_enqueue_block_editor_assets() {
		$script_path = WSUWP_Auto_Table_Of_Contents_Plugin::get('dir') . '/assets/js/index.js';
		$asset_path  = WSUWP_Auto_Table_Of_Contents_Plugin::get('dir') . '/assets/js/index.asset.php';
		$script_url  = _get_wsuwp_auto_table_of_contents_plugin_url() . '/assets/js/index.js';

		$asset_file = array(
			'dependencies' => array(),
			'version'      => file_exists( $script_path ) ? filemtime( $script_path ) : false,
		);

		if ( file_exists( $asset_path ) ) {
			$asset_file = include $asset_path;
		}

		wp_enqueue_script(
			'wsuwp-plugin-auto-table-of-contents-editor',
			$script_url,
			isset( $asset_file['dependencies'] ) ? $asset_file['dependencies'] : array(),
			isset( $asset_file['version'] ) ? $asset_file['version'] : false,
			true
		);
	}

	public static function wsuwp_enqueue_frontend_assets() {
		if ( ! self::has_auto_toc_block() ) {
			return;
		}

		$style_path       = WSUWP_Auto_Table_Of_Contents_Plugin::get( 'dir' ) . '/assets/css/style.min.css';
		$style_url        = _get_wsuwp_auto_table_of_contents_plugin_url() . '/assets/css/style.min.css';
		$frontend_js_path = WSUWP_Auto_Table_Of_Contents_Plugin::get( 'dir' ) . '/assets/js/front-end.js';
		$frontend_js_url  = _get_wsuwp_auto_table_of_contents_plugin_url() . '/assets/js/front-end.js';
		$frontend_asset   = WSUWP_Auto_Table_Of_Contents_Plugin::get( 'dir' ) . '/assets/js/front-end.asset.php';

		if ( file_exists( $style_path ) ) {
			wp_enqueue_style(
				'wsuwp-plugin-auto-table-of-contents',
				$style_url,
				array(),
				filemtime( $style_path )
			);
		}

		$asset_file = array(
			'dependencies' => array(),
			'version'      => file_exists( $frontend_js_path ) ? filemtime( $frontend_js_path ) : false,
		);

		if ( file_exists( $frontend_asset ) ) {
			$asset_file = include $frontend_asset;
		}

		$dependencies = isset( $asset_file['dependencies'] ) ? $asset_file['dependencies'] : array();
		$dependencies[] = 'jquery';
		$dependencies = array_unique( $dependencies );

		if ( file_exists( $frontend_js_path ) ) {
			wp_enqueue_script(
				'wsuwp-plugin-auto-table-of-contents-frontend',
				$frontend_js_url,
				$dependencies,
				isset( $asset_file['version'] ) ? $asset_file['version'] : false,
				true
			);
		}
	}

	public static function output_back_to_top_button() {
		if ( ! self::has_auto_toc_block_with_back_to_top() ) {
			return;
		}

		$label = __( 'Back to top', 'wsuwp-plugin-auto-table-of-contents' );

		echo '
		<div id="wsuwp-auto-toc-back-to-top" class="wsuwp-auto-toc-back-to-top" hidden aria-hidden="true">
			<a id="wsuwp-auto-toc-back-to-top-btn" class="wsuwp-auto-toc-back-to-top__btn" href="#wsuwp-auto-toc-top" aria-label="' . esc_attr( $label ) . '">
				<span class="wsuwp-auto-toc-back-to-top__icon" aria-hidden="true">↑</span>
				<span class="wsuwp-auto-toc-back-to-top__label">' . esc_html( $label ) . '</span>
			</a>
		</div>';
	}
}

WSUWP_Auto_Table_Of_Contents_Functions::init();