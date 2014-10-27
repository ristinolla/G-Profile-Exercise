/*
* Login controller
* - Handles the login flow too
*
*/

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', function($scope, $location, ApiService, OauthService, $rootScope) {



	var init = function(){
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
		// this neglects AUTO prompts with user not signed in
		// http://stackoverflow.com/questions/23020733/google-login-hitting-twice
		if( authResult.status.method !== "PROMPT" ) {
			return;
		}

		if( !$rootScope.authResult ){
			$scope.signedIn = false;
			return;
		}

		console.log(authResult);

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

	/*
	// Handle disconnect from app
	// This function is triggered when disconnect button is pressed
	// TODO: this might be better in login-controller...
	$scope.disconnect = function (){

		OauthService.disconnect( $rootScope.authResult )
			.then(function( result ){
				gapi.auth.signOut();

				$scope.logoutMessage = result.message;
			});
		};
		*/


});
