/*
* Login controller
* - Handles the login flow too
*
*/

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', function($scope, $location, ApiService, OauthService, $rootScope) {



	var init = function(){
		console.log("rootscopeauth: ", $rootScope.authResult);
		if(!$rootScope.authResult){
			$rootScope.isSignedIn = false;
		} else if($scope.authResult.status.signed_in){
			$rootScope.isSignedIn = true;
		}
	};

	init();

	// The call back function for the button.
	var signIn = function( authResult ) {


		$rootScope.authResult = authResult;
		// Autosign in
		if( authResult.status.method === "AUTO" &&
				authResult.status.signed_in &&
				authResult.status.google_logged_in
			){
				$location.path('/profile');
				return;
		}

		// Callback fired everytime signIn status changes
		// this takes care of the
		// http://stackoverflow.com/questions/23020733/google-login-hitting-twice
		if( authResult.status.method !== "PROMPT" ) {
			return;
		}

		if( !$rootScope.authResult ){
			$scope.signedIn = false;
			return;
		}

		$scope.$apply(function() {

			OauthService.processAuth( $rootScope.authResult )
				.then(function( result ){
					console.log(result);
					// Tests if signed in worked or not
					if(result.signedIn === true){
						$scope.isSignedIn = true;
						$location.path('/profile');

					} else {
						$scope.isSignedIn = false;
						console.log(result.message);
					}

				});
		});
	};




	// Google login button maker
	//
	$scope.login = function(){
		var additionalParams = {
			'callback': signIn
		};
		gapi.auth.signIn( additionalParams );
	};





});