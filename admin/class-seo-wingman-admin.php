<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.corephp.com/
 * @since      1.0.0
 *
 * @package    Seo_Wingman
 * @subpackage Seo_Wingman/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Seo_Wingman
 * @subpackage Seo_Wingman/admin
 * @author     `corePHP` <support@corephp.com>
 */
class Seo_Wingman_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Seo_Wingman_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Seo_Wingman_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name . '-animate',   plugin_dir_url( __FILE__ ) . 'css/animate.css',       array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name . '-chosen',    plugin_dir_url( __FILE__ ) . 'css/chosen.css',        array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name . '-bootstrap', plugin_dir_url( __FILE__ ) . 'css/bootstrap.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name . '-main',      plugin_dir_url( __FILE__ ) . 'css/seowingman.css',    array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Seo_Wingman_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Seo_Wingman_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script(
			$this->plugin_name . '-stripe',
			'https://js.stripe.com/v2/',
			array(),
			$this->version,
			false
		);

		wp_enqueue_script(
			$this->plugin_name . '-vendors',
			plugin_dir_url( __FILE__ ) . 'js/vendors.js',
			array(
				'jquery-ui-core',
				'jquery-ui-tooltip',
				'jquery-ui-tabs'
			),
			$this->version,
			false
		);

		wp_enqueue_script(
			$this->plugin_name . '-main',
			plugin_dir_url( __FILE__ ) . 'js/wingman.js',
			array(),
			$this->version,
			false
		);

	}

	/**
	 * Add admin menu link
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function add_menu_page() {

		$icon = base64_encode( file_get_contents( plugins_url( 'seo-wingman/admin/img/seo-wingman.svg' ) ) );

		add_menu_page(
			'SEO Wingman',                                              // Page title
			'SEO Wingman',                                              // Menu item text
			'manage_options',                                           // Capabilityes (permissions required for the user)
			'seo-wingman/admin/partials/seo-wingman-admin-display.php', // File to display
			'',                                                         // Custom function to invoke
			'data:image/svg+xml;base64,' . $icon,                       // Menu icon
			50                                                          // Menu position
		);

	}

	/**
	 * Add ajax action
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function seowingman_api() {

		$this->call( $_GET['method'], 'wingman/' . $_GET['resource'], $_POST['payload'], true );

	}

	/**
	 * Do the call to the API
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	private function call( $request_method = false, $service = false, $payload = false, $exit = true ) {

		header('Content-Type: application/json');

		$request_method or $request_method = $_SERVER['REQUEST_METHOD'];
		$service or $service = $_GET['service'];
		$payload or $payload = json_decode(file_get_contents("php://input"));

		//could be dealing with an image and it's associated bullshit
		$payload or $payload = json_decode($_POST['payload']);

		$payload = (object) $payload;

		$is_multipart = false;

		if(!empty($_FILES)){
			foreach($_FILES as $name=>$data){
				$payload->$name = new CurlFile($data['tmp_name']);
				$is_multipart = true;
			}
		}

		if($service == 'wingman/subscriber' && $request_method == 'POST'){
			$seowingman_user = $this->get_seowingman_user();
			$payload->analyst_login = $seowingman_user['login'];
			$payload->analyst_password = $seowingman_user['password'];
		}

		$auto_id = false;

		if(isset($payload->id) && $payload->id == 'auto') $auto_id = true;

		if($auto_id){
			if(!$payload->id = $this->get_auto_id(md5($service)))
				unset($payload->id);
		}
		//$exit=1; //turn on and go to index.php?option=com_pago&view=payoptions to test call
		$domain = 'https://api.pagocommerce.com/';
		$version = 'v1/';
		$testmode = 'v1';

		$url = $domain . $version . $service;

		$ch = curl_init();

		$header = [
			'api-domain: ' . $domain,
			'api-version: ' . $version,
			'api-testmode: ' . $testmode,
			'api-livemode: ' . 'false' //this is for wingman
		];

		if(!$is_multipart){
			$header[] = 'Content-Type: application/json';
			$payload_data = json_encode($payload);
		} else {
			$payload_data = $payload;
		}

		if($request_method == 'PATCH'){
			if(isset($payload->id)){
				$url = $url . '/' . str_replace('/', '*', $payload->id);
			} elseif($id = $this->get_auto_id(md5($service))) {
				$url = $url . '/' . str_replace('/', '*', $id);
				$this->set_auto_id(md5($service), 0);
			}

			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload_data);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
		}

		if($request_method == 'PUT'){
			if(isset($payload->id)){
				$url = $url . '/' . str_replace('/', '*', $payload->id);
			} elseif($id = $this->get_auto_id(md5($service))) {
				$url = $url . '/' . str_replace('/', '*', $id);
				$this->set_auto_id(md5($service), 0);
			}

			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload_data);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		}

		if($request_method == 'DELETE'){
			if(isset($payload->id)){
				$url = $url . '/' . str_replace('/', '*', $payload->id);
			} elseif($id = $this->get_auto_id(md5($service))) {
				$url = $url . '/' . str_replace('/', '*', $id);
				$this->set_auto_id(md5($service), 0);
			}

			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload_data);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		}

		if($request_method == 'GET'){
			if(isset($payload->id)){
				$url = $url . '/' . str_replace('/', '*', $payload->id);
			} elseif($id = $this->get_auto_id(md5($service))) {
				$url = $url . '/' . str_replace('/', '*', $id);
			}

			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload_data);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
		}

		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt( $ch, CURLOPT_CAINFO,         plugin_dir_path( __FILE__ ) . '../includes/cacert.crt' );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 1 );

		if($request_method == 'POST'){
			curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload_data);
		}

		if(!$output = curl_exec($ch)){
		    exit('API CURL ERROR: ' . curl_error($ch));
		}

		curl_close($ch);

		$output_array = json_decode($output);

		if($auto_id) $this->set_auto_id(md5($service), @$output_array->id);

		if($exit)
			exit($output);

		return $output_array;

	}

	private function get_seowingman_user() {

		$user_name  = 'seowingman';
		$user_email = 'info@seowingman.com';
		$user_pass  = wp_generate_password();

		$user_id = username_exists( $user_name );

		if ( !$user_id && false == email_exists( $user_email ) ) {
		    $user_id = wp_create_user( $user_name, $user_pass, $user_email );
		} else {
		    $user_id = wp_update_user([
				'user_pass'  => $user_pass,
				'user_email' => $user_email,
			]);
		}

		$seowingman_user = get_user_by( 'id', $user_id );

		// $seowingman_user->set_role( 'administrator' );

		return [
			'login'    => $user_name,
			'password' => $user_pass
		];

	}

	private function get_auto_id( $name_space ){

		if ( $name_space == md5( 'wingman/subscriptions' ) || $name_space == md5('wingman/s3' ) )
			$name_space = md5( 'wingman/subscriber' );

		return get_option( $name_space, 0 );

	}

	private function set_auto_id( $name_space, $id ){

		update_option( $name_space, $id );

	}

}
