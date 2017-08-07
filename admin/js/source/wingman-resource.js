;"use strict";

angular
	.module(
		"pagoWingmanResource",
		[
			"ngResource",
		]
	)
	.provider(
		"PagoResource",
		function PagoResourceProvider ()
		{
			var apiurl = "";

			this.apiurl = function ( url )
			{
				url && (apiurl = url);

				return apiurl;
			};

			var dataTransformation = function ( data, headersGetter )
			{
				data = data || {};
				data.id = "auto";

				var request = {
					action: "seowingman_api",
					payload: data,
				};

				return jQuery.param(request);
			};

			var defaultHeaders = {
				"Content-Type": function ( config )
				{
					return "application/x-www-form-urlencoded";
				},
			};

			this.$get = [
				"$resource",
				function( $resource )
				{
					return function ( resourceName, params, methods )
					{
						var defaults = {
							get: {
								method: "POST",
								isArray: false,
								transformRequest: dataTransformation,
								headers: defaultHeaders,
								cache: true,
								params: {
									method: "GET",
								},
							},
							save: {
								method: "POST",
								isArray: false,
								transformRequest: dataTransformation,
								headers: defaultHeaders,
								cache: true,
								params: {
									method: "POST",
								},
							},
							delete: {
								method: "POST",
								transformRequest: dataTransformation,
								headers: defaultHeaders,
								cache: true,
								params: {
									method: "DELETE",
								},
							},
						};

						methods = angular.merge( defaults, methods );

						params = params || {};
						params.resource = resourceName;

						var resource = $resource( apiurl, params, methods );

						return resource;
					};
				}
			];
		}
	);
