<?php

/**
 * Fired during plugin activation
 *
 * @link       https://www.corephp.com/
 * @since      1.0.0
 *
 * @package    Seo_Wingman
 * @subpackage Seo_Wingman/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Seo_Wingman
 * @subpackage Seo_Wingman/includes
 * @author     `corePHP` <support@corephp.com>
 */
class Seo_Wingman_Activator {

	/**
	 * Create plugin table.
	 *
	 * Create table to store ID's and other params
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		add_option( md5( 'wingman/subscriber' ),    0 );
		add_option( md5( 'wingman/subscriptions' ), 0 );
		add_option( md5( 'wingman/s3' ),            0 );
		add_option( md5( 'wingman/plans' ),         0 );

	}

}
