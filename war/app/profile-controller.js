/*
 *
 *
 *
*/

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileCtrl', function($scope, ApiService, OauthService) {


		$scope.isSignedIn = OauthService.isSignedIn;
		$scope.immediateFailed = false;
		$scope.authResult = {};
		$scope.errorMessage = false;

		$scope.profile = {};
		$scope.people = {};


		$scope.showProfile = function() {
			ApiService.getProfile().then(function( data ){
				console.log('Profile object', data);
				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];

			});

			ApiService.getPeople().then(function( data ){
				console.log('People object', data);
				$scope.people = data;
			});
		};



		// Handle disconnect from app
		$scope.disconnect = function (){
			OauthService.disconnect( $scope.authResult )
				.then(function( result ){
					gapi.auth.signOut();
					console.log(result);
					$scope.isSignedIn = false;
					$scope.profile = {};
					$scope.people = {};
				});
		};

		// The call back function for the button.
		$scope.signIn = function( authResult ) {

			// Callback fired everytime signIn status changes
			// this neglets the later.
			// http://stackoverflow.com/questions/23020733/google-login-hitting-twice
			if(authResult.status.method !== "PROMPT"){
				return;
			}

			console.log(authResult);
			$scope.$apply(function() {

				$scope.authResult = authResult;

				OauthService.processAuth( authResult )
					.then(function( result ){
						console.log(result);
						// Tests if signed in worked or not
						if(result.signedIn === true){
							$scope.isSignedIn = true;
							$scope.showProfile();

						} else {
							$scope.isSignedIn = false;
							console.log(result.message);
						}

					});
			});
		};


		// JIIHAA
		$scope.login = function(){
			var additionalParams = {
		     'callback': $scope.signIn
		  };
			gapi.auth.signIn( additionalParams );
		};




});
