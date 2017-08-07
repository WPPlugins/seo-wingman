;"use strict";

angular
	.module(
		"pagoWingmanVariables",
		[]
	)
	.constant(
		"comurl",
		"../wp-content/plugins/seo-wingman/"
	)
	.constant(
		"appurl",
		"../wp-content/plugins/seo-wingman/admin/js/"
	)
	.constant(
		"viewurl",
		"../wp-content/plugins/seo-wingman/admin/partials/"
	)
	.constant(
		"symbols",
		{
			"usd": "$"
		}
	)
	.run(
		function (
			$rootScope,
			symbols,
			comurl,
			viewurl
		)
		{
			$rootScope.comurl  = comurl;
			$rootScope.viewurl = viewurl;
			$rootScope.symbols = symbols;
		}
	);
