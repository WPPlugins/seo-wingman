<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.corephp.com/
 * @since      1.0.0
 *
 * @package    Seo_Wingman
 * @subpackage Seo_Wingman/admin/partials
 */
?>

<div id="pago-wingman-app" data-ng-cloak>
	<div data-ng-view data-ng-cloak data-ng-show="ready" data-onload="$root.viewLoaded()" autoscroll="true"></div>
</div>
