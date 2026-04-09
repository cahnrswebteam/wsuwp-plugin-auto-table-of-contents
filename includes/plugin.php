<?php namespace WSUWP\Plugin\AutoTableOfContents;

class WSUWP_Auto_Table_Of_Contents_Plugin {

	public static function get( $property ) {

		switch ( $property ) {

			case 'version':
				return WSUWPAUTOTABLEOFCONTENTSVERSION;

			case 'dir':
				return plugin_dir_path( dirname( __FILE__ ) );

			default:
				return '';

		}

	}

	public static function init() {

		// Do plugin stuff here
		require_once __DIR__ . '/functions.php';
		require_once __DIR__ . '/blocks.php';

	}


}

WSUWP_Auto_Table_Of_Contents_Plugin::init();