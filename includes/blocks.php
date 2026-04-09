<?php namespace WSUWP\Plugin\AutoTableOfContents;

class Register_Block_WSUWP_Auto_TOC  {
    protected static $block_names   = array(
        'wsuwp/auto-toc'
    );

    protected static $register_blocks = array(
		'wsuwp/auto-toc'   			=> 'Block_WSUWP_Auto_TOC'
	);

    public static function register_block()
    {
        // Get blocks to register
		$blocks = self::$register_blocks;

		// Get the block directory
		$block_dir = WSUWP_Auto_Table_Of_Contents_Plugin::get( 'dir' ) . 'blocks/';
        
		foreach ( $blocks as $block => $class ) {

			// folder name should be the block name with the / replaced with - (i.e. wsuwp/name -> wsupw-name)
			$block_folder = str_replace( '/', '-', $block );

			$block_class = __NAMESPACE__ . '\\' . $class;

			require_once $block_dir . $block_folder . '/block.php';

			// Call get('register_block') to check if the block should be registered, default is true in class-block.php
			if ( call_user_func( array( $block_class, 'get' ), 'register_block' ) ) {
				register_block_type(
					$block,
					array(
						'api_version'     => 2,
						'render_callback' => array( $block_class, 'render_block' ),
						'editor_script'   => 'wsuwp-plugin-auto-table-of-contents',
					)
				);
			}
		}

        add_filter(
            'wsu_allowed_blocks_filter',
            function ($blocks) {
                foreach (self::$block_names as $block_name) {
                    if (!in_array($block_name, $blocks, true)) {
                        $blocks[] = $block_name;
                    }
                }
                return $blocks;
            }
        );
    }

    public static function init()
    {
        add_action('init', __CLASS__ . '::register_block');
        
    }
}

Register_Block_WSUWP_Auto_TOC::init();
