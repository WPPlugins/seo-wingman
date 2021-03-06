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

;"use strict";

angular
	.module( 
		"pagoWingmanFormly", 
		[
			"ngSanitize",
			"pagoWingmanVariables",
			"formly",
		] 
	)
	.directive(
		"chosen", 
		[
			"$timeout",
			function () 
			{
				return {
					restrict: "A",
					link: function ( $scope, elm, attrs ) 
					{
						// update when data is loaded first time
						$scope.$watch(
							attrs.chosen, 
							function ( oldValue, newValue ) 
							{
								elm.trigger("chosen:updated");
							}
						);
						
						// update when the model changes
						$scope.$watch( 
							attrs.ngModel, 
							function ( oldValue, newValue ) 
							{
								elm.trigger("chosen:updated");
							}
						);
						
						// update when options change
						$scope.$watch( 
							"to.options", 
							function ( oldValue, newValue ) 
							{
								elm.trigger("chosen:updated");
							}
						);
						
						elm.chosen({
							"disable_search_threshold": 6
						}).change( function () {
							$scope.fc.$setTouched();
						});
					}
				};
			}
		]
	)
	.directive(
		"messages",
		[
			"viewurl",
			"$timeout",
			function ( viewurl, $timeout )
			{
				return {
					restrict: "E",
					templateUrl: viewurl + "directives/messages.html",
					scope: {
						messages: "="
					},
					link: function ( $scope, elm, attrs, ctrl )
					{
						$scope.messages = $scope.messages || [];
						
						$scope.$watchCollection(
							function () 
							{
								return $scope.messages;	
							},
							function ( newValue, oldValue )
							{
								elm.toggleClass( "ng-hide", newValue.length <= 0 );
							}
						);
						
						$scope.dismiss = function ( $index )
						{
							$scope.messages.splice( $index, 1 );
						};
					}
				};
			}
		]
	)
	.run(
		function ( 
			formlyConfig, 
			viewurl
		) 
		{
		
		// Formly View URL
		var fvurl = viewurl + "formly/";
		
		// Make form validate on submit
		formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = "fc.$touched || form.$$parentForm.$submitted";
		
		// Form SubHeader (light grey background)
		formlyConfig.setType({
			name: "subheader",
			templateUrl: fvurl + "subheader.html",
		});
		
		// Regular input
		formlyConfig.setType({
			name: "input",
			templateUrl: fvurl + "input.html",
			link: function ( $scope, elm, attrs )
			{
				var defaults = {
					type: "text",
					times: 1,
				};
				
				$scope.to = angular.extend( defaults, $scope.to );
				
				$scope._repeat = Array.apply( null, Array( $scope.to.times ) ).map( function (x, i) { return i; } );
			}
		});
		
		// Textarea
		formlyConfig.setType({
			name: "textarea",
			templateUrl: fvurl + "textarea.html",
			link: function ( $scope, elm, attrs )
			{
				var defaults = {
					rows: "3"
				};
				
				angular.extend( $scope.to, defaults );
			}
		});
		
		// Select input
		formlyConfig.setType({
			name: "select",
			templateUrl: fvurl + "select.html",
			link: function ( $scope, elm, attrs )
			{
				var defaults = {
					orderBy: "label"
				};
				
				angular.extend( defaults, $scope.to );
			}
		});
		
		// Checkbox input
		formlyConfig.setType({
			name: "checkbox",
			templateUrl: fvurl + "checkbox.html",
		});
		
		// Keywords input
		formlyConfig.setType({
			name: "keywords",
			templateUrl: fvurl + "keywords.html",
			link: function ( $scope, elm, attrs )
			{
				// Current typed keyword
				$scope.kw = null;
				
				$scope.full = function ()
				{
					return ( $scope.model.keywordsArray && $scope.model.keywordsQty ) &&
						( $scope.model.keywordsArray.length == $scope.model.keywordsQty );
				};
				
				var addKeyword = function ()
				{
					if ( !$scope.kw )
						return;
					
					if ( $scope.model.keywordsArray.length == $scope.model.keywordsQty )
						return;
					
					$scope.model.keywordsArray.push( 
						{
							keyword: $scope.kw,
							temp: true
						}
					);
					$scope.kw = null;
				};
				
				$scope.handleInput = function ( $event )
				{
					if ( $event.keyCode == 13 )
						return addKeyword();
				};
				
				$scope.removeKeyword = function ( $index )
				{
					$scope.model.keywordsArray.splice( $index, 1 );
				};
			}
		});
		
		// Validation messages
		formlyConfig.setWrapper({
			name: "messages",
			templateUrl: fvurl + "messages.html"
		});
		
	});
;"use strict";

angular
	.module(
		"pagoWingmanStripe",
		[]
	)
	.config(function () {
		Stripe.setPublishableKey("pk_test_tZ3SKiYxN7xrHbJ81pujizUZ");
	})
	.factory(
		"StripeValidator",
		function ()
		{
			var sv = function()
			{
				this.number = Stripe.card.validateCardNumber;
				this.expiry = Stripe.card.validateExpiry;
				this.cvc    = Stripe.card.validateCVC;
				this.type   = Stripe.card.cardType;
			};
			
			return new sv();
		}
	);
;"use strict";

angular
	.module(
		"pagoWingmanGeolocation",
		[]
	)
	.provider(
		"Geolocation",
		function GeolocationProvider ()
		{
			var source = "http://api.geonames.org/";
			var user   = "corephp";
			var format = "JSON";
			
			var usernameFn = function ( newUser ) 
			{
				if ( "string" == typeof newUser )
					user = newUser;
				
				return user;
			};
			
			this.username = usernameFn;
			
			this.$get = [
				"$http",
				"$q",
				function ( $http, $q )
				{
					var Geolocation = {
						username: usernameFn,
						getCountries: function ()
						{
							var d = $q.defer();
							
							$http.get( source + "countryInfo" + format + "?username=" + this.username() ).then(
								function ( response )
								{
									var countries = response.data.geonames;
									
									for (var i = 0, l = countries.length; i < l; i++) {
										countries[i].label = countries[i].countryName;
										countries[i].value = countries[i].countryCode;
									}
									
									d.resolve(countries);
								},
								function ()
								{
									d.reject();
								}
							);
							
							return d.promise;
						},
						getStates: function ( country ) 
						{
							var d = $q.defer();
							
							$http.get( source + "search" + format + "?country=" + country + "&featureCode=ADM1" + "&username=" + this.username() ).then(
								function ( response ) 
								{
								    var states = response.data.geonames;
								    
								    for (var i = 0, l = states.length; i < l; i++) {
								    	states[i].label = states[i].value = states[i].name;
								    }
								    
								    d.resolve(states);
								},
								function () 
								{
								    d.reject();
								}
							);
							
							return d.promise;
						}
					};
					
					return Geolocation;
				}
			];
		}
	);
;"use strict";

angular
	.module(
		"pagoWingmanPlans",
		[
			"pagoWingmanResource",
		]
	)
	.factory(
		"Plans",
		[
			"PagoResource",
			function( PagoResource )
			{
				return PagoResource( "plans" );
			}
		]
	)
	.directive(
		"wingmanPlan",
		[
			"viewurl",
			function( viewurl )
			{
				return {
					restrict: "E",
					scope: {
						plan: "=plan",
					},
					templateUrl: viewurl + "directives/plan.html"
				};
			}
		]
	)
	.controller(
		"PlansController",
		[
			"Plans",
			"$rootScope",
			"$scope",
			"$location",
			function ( Plans, $rootScope, $scope, $location )
			{
				$scope.ready = true;
				
				$scope.plans = null;
				$scope.customPlan = {
					id: "CUS",
					name: "Custom",
					metadata: {
						description: "<ul><li>One of our representatives will be happy to help develop a package custom fit to your own unique needs.</li><!--<li>Contact us now at <a href='tel:269-979-5582'>269-979-5582</a></li>--></ul>"
					}
				};
				$scope.interval = "month";
				
				var plans = Plans.get(function () {
					$scope.plans = plans.data;
				});
				
				
				$scope.choose = function ( plan )
				{
					if ( "custom" == plan.name.toLowerCase() )
						return window.open("http://seowingman.com/#section04");
					
					$rootScope.plan = plan;
					$location.path("/subscribe");
				};
				
				
				$scope.showSignUp = function ()
				{
					if ( $location.path().match( "plan" ) )
						return true;
				};
			}
		]
	);
;"use strict";

angular
	.module(
		"pagoWingmanSubscriber",
		[
			"ngSanitize",
			"pagoWingmanResource",
			"formly",
			"pagoWingmanFormly",
			"pagoWingmanStripe",
			"pagoWingmanGeolocation",
			"pagoWingmanPlans",
		]
	)
	.factory(
		"Subscriber",
		[
			"PagoResource",
			function( PagoResource )
			{
				return PagoResource( "subscriber" );
			}
		]
	)
	.factory(
		"Subscriptions",
		[
			"PagoResource",
			function( PagoResource )
			{
				return PagoResource( "subscriptions" );
			}
		]
	)
	.controller(
		"SubscriberController",
		[
			"_access",
			"Subscriber",
			"Subscriptions",
			"$scope",
			"$rootScope",
			"StripeValidator",
			"$http",
			"$q",
			"$location",
			"Geolocation",
			"$sce",
			function (
				_access,
				Subscriber,
				Subscriptions,
				$scope,
				$rootScope,
				StripeValidator,
				$http,
				$q,
				$location,
				Geolocation,
				$sce
				)
			{
				// Page and requirements are fully loaded
				$scope.ready    = false;

				// Loading indicator
				$scope.loading  = false;

				// Check page access
				if ( undefined === $rootScope.plan && !_access && "/contact-us" != $location.path() )
					$location.path("/plans");


				// Local model
				$scope.subscription = {};


				// Fields definition
				var subscriptionFields = [
					{
						type: "subheader",
						templateOptions: {
							label: "User Information"
						},
					},
					{
						fieldGroup: [
							{
								type: "input",
								key: "name",
								wrapper: "messages",
								templateOptions: {
									required: true,
									label: "Full Name",
								},
								validators: {
									"full-name": function ( viewValue, modelValue, scope )
									{
										var v = modelValue || viewValue;

										return "string" == typeof v && v.trim().split(" ").length > 1;
									}
								},
							},
							{
								className: "row",
								fieldGroup: [
									{
										type: "input",
										key: "email",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Email",
											type: "email",
										}
									},
									{
										type: "input",
										key: "phone",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Phone",
											type: "tel",
										}
									},
								]
							},
						]
					},
					{
						type: "subheader",
						templateOptions: {
							label: "Address Information"
						}
					},
					{
						className: "",
						fieldGroup: [
							{
								type: "input",
								key: "line1",
								wrapper: "messages",
								templateOptions: {
									required: true,
									label: "Address Line 1",
								}
							},
							{
								type: "input",
								key: "line2",
								wrapper: "messages",
								templateOptions: {
									label: "Address Line 2",
								}
							},
							{
								className: "row",
								fieldGroup: [
									{
										type: "select",
										key: "country",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Country",
											options: []
										},
										controller: function( $scope, Geolocation )
										{
											Geolocation.getCountries().then(
												function ( countries )
												{
													$scope.to.options = countries;
												}
											);
										},
									},
									{
										type: "select",
										key: "state",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "State",
											orderBy: "value",
											options: []
										},
										controller: function ( $scope, Geolocation )
										{
											$scope.$watch(
												"model.country",
												function ( newValue, oldValue )
												{
													if ( undefined !== newValue )
														Geolocation.getStates( newValue ).then(
															function ( states )
															{
																$scope.to.options = states;
															}
														);
												}
											);
										}
									},
								]
							},
							{
								className: "row",
								fieldGroup: [
									{
										type: "input",
										key: "city",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "City",
										}
									},
									{
										type: "input",
										key: "postal_code",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											// minlength: 5,
											// maxlength: 5,
											label: "Zip Code",
											type: "tel",
										}
									},
								]
							},
						]
					},
				];
				var creditCardFields   = [
					{
						type: "subheader",
						templateOptions: {
							label: "Credit Card Information"
						}
					},
					{
						className: "pg-pad-20 pg-mb-20",
						fieldGroup: [
							{
								className: "row",
								fieldGroup: [
									{
										type: "input",
										key: "number",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Number",
										},
										validators: {
											"cc-number": function ( viewValue, modelValue, scope )
											{
												var v = modelValue || viewValue;

												return StripeValidator.number(v);
											}
										}
									},
									{
										type: "input",
										key: "cvc",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "CVC",
											type: "number"
										},
										validators: {
											"cc-cvc": function ( viewValue, modelValue, scope )
											{
												var v = modelValue || viewValue;

												return StripeValidator.cvc(v);
											}
										}
									},
								]
							},
							{
								className: "row",
								fieldGroup: [
									{
										type: "select",
										key: "exp_month",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Expire Month",
											orderBy: "value",
											options: (function ()
											{
												var months = [
													"January",
													"February",
													"March",
													"April",
													"May",
													"June",
													"July",
													"August",
													"September",
													"October",
													"November",
													"December"
												];
												var ret = [];

												for (var i = 0; i < months.length; i++) {
													var k = ( i + 1 < 10 ) ? "0" + ( i + 1 ) : ( i + 1 );
													var m = months[i].substr(0, 3);

													ret.push({
														label: m + " (" + k + ")",
														value: i + 1
													})
												}

												return ret;
											})()
										},
										validators: {
											"cc-expiry-month": function ( viewValue, modelValue, scope )
											{
												var v = modelValue || viewValue;
												var y = scope.model.year;

												if ( undefined === y )
													return true;

												return StripeValidator.expiry(v, y);
											}
										},
									},
									{
										type: "select",
										key: "exp_year",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Expire Year",
											options: (function ()
											{
												var ret = [];
												var y = new Date().getFullYear();
												var n = 20;

												for (var i = y; i < y + n; i++) {
													ret.push({
														label: i,
														value: i
													});
												}

												return ret;
											})()
										},
										validators: {
											"cc-expiry-year": function ( viewValue, modelValue, scope )
											{
												var v = modelValue || viewValue;
												var m = scope.model.month;

												if ( undefined === m )
													return true;

												return StripeValidator.expiry(m, v);
											}
										},
									},
								]
							},
						]
					},
				];
				var termsFields        = [
					{
						type: "checkbox",
						key: "terms",
						wrapper: "messages",
						templateOptions: {
							required: true,
							label: "I confirm that I've read and agree with the <a class='terms-and-conditions'>terms and conditions</a>.",
						}
					},
				];

				var keywordsFields = [
					{
						type: "subheader",
						templateOptions: {
							label: "Keywords"
						},
						link: function(scope, el, attrs, ctrl) {
							$scope.$watch( "subscription", function ( newValue ) {
								if ( !newValue || !newValue.keywordsQty )
									return;

								scope.to.label  = "Keywords - ";
								scope.to.label += $scope.subscription.keywordsQty - $scope.subscription.keywordsArray.length;
								scope.to.label += " out of ";
								scope.to.label += $scope.subscription.keywordsQty;
								scope.to.label += " available.";

							}, true);
						}
					},
					{
						className: "pg-mb-20",
						fieldGroup: [
							{
								type: "keywords",
								key: "keywords",
								wrapper: "messages",
								templateOptions: {
									label: "Type your keyword and then press enter",
								},
							},
						],
					}
				];
				var competitorsFields = [
					{
						type: "subheader",
						templateOptions: {
							label: "Competitors"
						},
					},
					{
						className: "pg-mb-20",
						fieldGroup: [
							{
								type: "input",
								key: "competitors1",
								wrapper: "messages",
								templateOptions: {
									label: "Competitor #1",
									placeholder: "domain.com",
									required: true,
								},
							},
							{
								type: "input",
								key: "competitors2",
								wrapper: "messages",
								templateOptions: {
									label: "Competitor #2",
									placeholder: "domain.com",
									required: true,
								},
							},
							{
								type: "input",
								key: "competitors3",
								wrapper: "messages",
								templateOptions: {
									label: "Competitor #3",
									placeholder: "domain.com",
									required: true,
								},
							},
						],
					}
				];

				var contactFields = [
					{
						type: "subheader",
						templateOptions: {
							label: "Your Information"
						},
					},
					{
						className: "pg-pad-20 pg-mb-20",
						fieldGroup: [
							{
								type: "input",
								key: "name",
								wrapper: "messages",
								templateOptions: {
									required: true,
									label: "Full Name",
								},
								validators: {
									"full-name": function ( viewValue, modelValue, scope )
									{
										var v = modelValue || viewValue;

										return "string" == typeof v && v.trim().split(" ").length > 1;
									}
								},
							},
							{
								className: "row",
								fieldGroup: [
									{
										type: "input",
										key: "email",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Email",
											type: "email",
										}
									},
									{
										type: "input",
										key: "phone",
										wrapper: "messages",
										className: "col-sm-6",
										templateOptions: {
											required: true,
											label: "Phone",
											type: "tel",
										}
									},
								]
							},
							{
								type: "textarea",
								key: "message",
								wrapper: "messages",
								templateOptions: {
									required: true,
									label: "Your message",
								},
							},
						],
					},
				];

				$scope.fields = {
					information : subscriptionFields,
					registration: subscriptionFields.concat( termsFields ),
					subscription: subscriptionFields.concat( creditCardFields, termsFields ),
					keywords    : keywordsFields,
					competitors : competitorsFields,
					inputs      : [
						{
							className: "",
							fieldGroup: [
								{
									className: "col-sm-6",
									fieldGroup: keywordsFields,
								},
								{
									className: "col-sm-6",
									fieldGroup: competitorsFields,
								},
							],
						},
					],
					contact     : contactFields,
				};


				//
				jQuery("body").on("click", ".terms-and-conditions", function(){jQuery('#terms-and-conditions').modal()})


				// Functions definitions

				// Utils
				var getIp = function ()
				{
					var q = $q.defer();

					if ( !$scope.subscription.ip )
						q.resolve($http.get( "https://api.ipify.org/?format=json" ));
					else
						q.resolve( { data: { ip: $scope.subscription.ip } } );

					return q.promise;
				};


				// Subscriber
				// Get subscriber information
				// This loads user data, address
				// Payment and subscriptions
				$scope.get = function ()
				{
					Subscriber.get(
						function ( data )
						{
							if ( !data.id )
								$location.path("/plans");
							else
								$rootScope.subscriber = data;

							$scope.ready = true;
						}
					);
				};

				$scope.subscribe = function ()
				{
					if ( !$scope.subscribeForm.$valid )
						return;

					$scope.loading = true;

					// Add site to the subscriber
					$scope.subscription.site = $location.host();

					// Add IP address to subscriber
					getIp()
						.then(
							function ( response )
							{
								$scope.subscription.ip = response.data.ip;
							}
						)
						.then(
							function ()
							{
								return Subscriber.save( $scope.subscription ).$promise;
							}
						)
						.then(
							function ( response )
							{
								if ( response.status && 500 == response.status )
									return $q.reject( response );

								$rootScope.subscriber = response;

								return $q.resolve( Subscriptions.save( { plan_id: $rootScope.plan.id } ).$promise );
							}
						)
						.then(
							function ( response )
							{
								if ( response.status && 500 == response.status )
									return $scope.messages[0] = response.detail;

								$location.path("/dashboard");

								$rootScope.subscriber.subscriptions.data[0] = response;
							},
							function ( error )
							{
								$scope.messages[0] = error.detail;
							}
						)
						.finally(
							function ()
							{
								$scope.loading = false;
							}
						);
				};




				$scope.updateSubscription = function ()
				{
					if ( !$scope.subscription.competitors1
						|| !$scope.subscription.competitors2
						|| !$scope.subscription.competitors3 )
						return $scope.messages[0] = "Please, fill all the competitors";


					$scope.loading = true;

					$scope.subscription.competitorsArray[0] = $scope.subscription.competitors1;
					$scope.subscription.competitorsArray[1] = $scope.subscription.competitors2;
					$scope.subscription.competitorsArray[2] = $scope.subscription.competitors3;

					var keywords = [];
					angular.forEach(
						$scope.subscription.keywordsArray,
						function ( value, key )
						{
							keywords.push( value.keyword );
						}
					);

					var metadata = {};

					if ( keywords.join(",").length > 0 )
						metadata.keywords = keywords.join( "," );

					metadata.top_three = $scope.subscription.competitorsArray.join(",");

					metadata.analyst_login    = $scope.subscription.analyst_login;
					metadata.analyst_password = $scope.subscription.analyst_password;

					Subscriptions.save(
						{
							plan_id: $scope.subscriber.subscriptions.data[0].plan.id,
							metadata: metadata,
						},
						function ( response )
						{
							$scope.loading = false;

							if ( response.status && 500 == response.status )
								return $scope.messages[0] = response.detail;

							angular.forEach(
								$scope.subscription.keywordsArray,
								function ( value, key )
								{
									$scope.subscription.keywordsArray[key].temp = false;
								}
							)
						}
					);
				};


				$scope.unsubscribe = function ()
				{
					$scope.subscription = undefined;
					$scope.subscriber   = undefined;
					$location.path("/unsubscribed");
					Subscriber.remove();
				};


				$scope.update = function ()
				{
					if ( !$scope.myAccountForm.$valid )
						return;

					$scope.loading = true;

					getIp()
						.then(
							function( response )
							{
								$scope.subscription.ip = response.data.ip;
								$scope.subscription.number = "xxxx";

								return Subscriber.save( $scope.subscription ).$promise;
							}
						)
						.then(
							function ( response )
							{
								$rootScope.subscriber = response;

								$scope.messages.push("Your informations were updated");
							},
							function ( response )
							{
								$scope.messages.push("An error occurred, please try again or contact us for support");
							}
						)
						.catch(
							function ( response )
							{

							}
						)
						.finally(
							function ()
							{
								$scope.loading = false;
							}
						);
				};


				// Load subscriber data and start the app
				if ( _access && !$rootScope.subscriber )
					$scope.get();
				else
					$scope.ready = true;

				$rootScope
					.$watch(
						"subscriber",
						function ( newValue, oldValue )
						{
							if ( !newValue || angular.equals( newValue, {} ) )
								return;

							var s = newValue;

							$scope.subscription.name          = s.metadata.name;
							$scope.subscription.phone         = s.metadata.phone;
							$scope.subscription.email         = s.email;
							$scope.subscription.site          = s.metadata.site;
							$scope.subscription.line1         = s.shipping.address.line1;
							$scope.subscription.line2         = s.shipping.address.line2;
							$scope.subscription.city          = s.shipping.address.city;
							$scope.subscription.state         = s.shipping.address.state;
							$scope.subscription.country       = s.shipping.address.country;
							$scope.subscription.postal_code   = s.shipping.address.postal_code;

							$scope.subscription.analyst_login    = s.metadata.analyst_login;
							$scope.subscription.analyst_password = s.metadata.analyst_password;

							$scope.subscription.keywordsQty   = s.subscriptions.data[0].plan.metadata.keywords;

							if ( typeof s.subscriptions.data[0].metadata.keywords == "string" )
								s.subscriptions.data[0].metadata.keywords = s.subscriptions.data[0].metadata.keywords.split(",");

							var ka = [];
							angular.forEach(
								s.subscriptions.data[0].metadata.keywords,
								function ( value, key )
								{
									ka.push(
										{
											keyword: value,
											temp: false
										}
									);
								}
							);

							$scope.subscription.keywordsArray = ka;

							if ( typeof s.subscriptions.data[0].metadata.top_three == "string" )
								s.subscriptions.data[0].metadata.top_three = s.subscriptions.data[0].metadata.top_three.split(",");

							$scope.subscription.competitorsArray = s.subscriptions.data[0].metadata.top_three || [];
							$scope.subscription.competitors1 = $scope.subscription.competitorsArray[0] || "";
							$scope.subscription.competitors2 = $scope.subscription.competitorsArray[1] || "";
							$scope.subscription.competitors3 = $scope.subscription.competitorsArray[2] || "";
						},
						true
					);
			}
		]
	);

;"use strict";

angular
	.module(
		"pagoWingmanS3",
		[
			"pagoWingmanResource",
		]
	)
	.factory(
		"S3",
		[
			"PagoResource",
			function( PagoResource )
			{
				return PagoResource( "s3", null, {
					save: {
						isArray: true,
					},
					get: {
						cache: false,
					}
				} );
			}
		]
	)
	.controller(
		"S3Controller",
		[
			"S3",
			"$rootScope",
			"$scope",
			"$location",
			"$interval",
			"$timeout",
			function ( S3, $rootScope, $scope, $location, $interval, $timeout )
			{
				$scope.loading = true;

				$scope.messages = [];
				$scope.files    = [];
				$scope.analyst  = {
					analyst_name: "Unassigned",
					status: "0"
				};
				$scope.status = [ "Pending", "Started", "Completed" ];

				var goUp = function ()
				{
					var msgs = jQuery( ".messages" );

					if ( msgs.get(0) )
						msgs.scrollTop( msgs.get(0).scrollHeight );
				};

				var prev;
				var load = function ( stop )
				{
					$timeout.cancel(prev);

					S3.get(
						function ( response ) {
							$scope.messages = response.messages;
							$scope.files    = response.files;

							if ( response.analyst )
								$scope.analyst = response.analyst;

							$scope.loading = false;

							prev = $timeout( load, 10000 );

							if ( stop )
								$timeout.cancel(prev);

							$timeout( goUp, 10 );
						}
					);
				};

				$scope.load = function ()
				{
					load();
				};

				$scope.message = null;

				$scope.send = function ()
				{
					if ( $scope.message == "" && $scope.message == null )
						return;

					var msg = {
						name: $rootScope.subscriber.metadata.name,
						message: $scope.message
					};

					$scope.messages.push( msg );
					$scope.message = null;

					$timeout( goUp, 10 );

					S3.save(
						msg,
						function ()
						{
							load();
						}
					);
				};
			}
		]
	);

;"use strict";

angular
	.module(
		"pagoWingman",
		[
			"ngRoute",
			"ngSanitize",
			"ngMessages",
			"pagoWingmanVariables",

			"pagoWingmanSubscriber",
			"pagoWingmanPlans",
			"pagoWingmanS3",
		]
	)
	.config([
		"viewurl",
		"$routeProvider",
		"$locationProvider",
		"$httpProvider",
		"PagoResourceProvider",
		function ( viewurl, $routeProvider, $locationProvider, $httpProvider, PagoResourceProvider )
		{
			$httpProvider.defaults.cache = true;

			PagoResourceProvider.apiurl( ajaxurl );

			$routeProvider
				.when(
					"/plans",
					{
						templateUrl: viewurl + "plans.php",
						controller: "PlansController",
						resolve: {
							_access: function ()
							{
								return 0;
							}
						}
					}
				)
				.when(
					"/change-plan",
					{
						templateUrl: viewurl + "change-plan.php",
						controller: "SubscriberController",
						resolve: {
							_access: function ()
							{
								return 1;
							}
						}
					}
				)
				.when(
					"/subscribe",
					{
						templateUrl: viewurl + "subscribe.php",
						controller: "SubscriberController",
						resolve: {
							_access: function ()
							{
								return 0;
							},

						}
					}
				)
				.when(
					"/contact-us",
					{
						templateUrl: viewurl + "contact-us.php",
						controller: "SubscriberController",
						resolve: {
							_access: function ()
							{
								return 0;
							}
						}
					}
				)
				.when(
					"/unsubscribed",
					{
						templateUrl: viewurl + "unsubscribed.php",
						controller: "SubscriberController",
						resolve: {
							_access: function ()
							{
								return 0;
							}
						}
					}
				)
				.when(
					"/dashboard",
					{
						templateUrl: viewurl + "dashboard.php",
						controller: "SubscriberController",
						resolve: {
							_access: function ()
							{
								return 1;
							}
						}
					}
				).otherwise(
					{
						redirectTo: "/dashboard",
					}
				);
		}
	])
	.run(
		function ( $rootScope, $location, $timeout )
		{
			$rootScope.$on(
				"$locationChangeSuccess",
				function ( newUrl, oldUrl, newState, oldState )
				{
					$rootScope.path = $location.path();
				}
			);

			$rootScope.viewLoaded = function ()
			{
				jQuery( "#tabs" ).tabs();
			};
		}
	);

angular
	.element( document )
	.ready(
		function ()
		{
			angular.bootstrap(
				angular.element( "#pago-wingman-app" ),
				[
					"pagoWingman"
				]
			);
		}
	);
