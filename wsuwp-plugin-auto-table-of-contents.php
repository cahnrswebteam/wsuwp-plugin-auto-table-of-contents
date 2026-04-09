<?php
/**
 *
 * @wordpress-plugin
 * Plugin Name:       WSUWP Auto Table of Contents
 * Plugin URI:        https://cahnrs.wsu.edu/
 * Description:       Creates a table of contents depending on the headings used in the content. 
 * Version:           1.0.0
 * Author:            CAHNRS Communications
 * Author URI:        https://cahnrs.wsu.edu/
 * Text Domain:       wsuwp-plugin-auto-table-of-contents
 */


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

//Checks to see if WSUWP Gutenberg plugin is activated. 
register_activation_hook( __FILE__, 'wsuwp_plugin_gutenberg_auto_toc_plugin_check' );

function wsuwp_plugin_gutenberg_auto_toc_plugin_check(){
    if ( ! is_plugin_active( 'wsuwp-plugin-gutenberg/wsuwp-plugin-gutenberg.php' ) and current_user_can( 'activate_plugins' ) ) {
      wp_die('Sorry, this plugin requires WSUWP Gutenberg to be activated. Please activate plugin that plugin first before activating this one. <br><a href="' . admin_url( 'plugins.php' ) . '">&laquo; Return to Plugins</a> <style>div#query-monitor{display:none;}');
    }
}

//Include files from WSUWP Gutenberg Plugin
require_once( WP_PLUGIN_DIR . '/wsuwp-plugin-gutenberg/includes/plugin.php');

//Define the version of this CAHNRS Gutenberg plugin
define( 'WSUWPAUTOTABLEOFCONTENTSVERSION', '1.0.0' );

// Gets WSUWP Auto Table of Contents plugin URL.
function _get_wsuwp_auto_table_of_contents_plugin_url() {
  static $wsuwp_auto_table_of_contents_plugin_url;

  if (empty($wsuwp_auto_table_of_contents_plugin_url)) {
    $wsuwp_auto_table_of_contents_plugin_url = plugins_url(null, __FILE__);
  }

  return $wsuwp_auto_table_of_contents_plugin_url;
}


//Load other files of this plugin
function wsuwp_auto_table_of_contents_init(){
	require_once __DIR__ . '/includes/plugin.php';
}

add_action( 'plugins_loaded', 'wsuwp_auto_table_of_contents_init' );

