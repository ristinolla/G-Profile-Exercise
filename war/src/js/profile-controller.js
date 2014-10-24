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

		// Returns current city if there is one
		// if none, then returns false
		function getCurrentCity( profile ){
			var places = profile.placesLived;
			if(typeof places === 'undefined' ){
				return false;
			}

			for(var i in places){
				if(places[i].primary){
					return places[i].value;
				}
			}
			return undefined;
		}


		$scope.showProfile = function() {
			ApiService.getProfile().then(function( data ){
				console.log('Profile object', data);
				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];
				$scope.profile.homeTown = getCurrentCity( $scope.profile );
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
				console.log('not promt, but immediate?', authResult.status);
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



		// Reveal
		$scope.revealContent = function(obj, $event){
			classie.addClass( $event.srcElement, 'hide' );
			classie.removeClass(document.getElementById( obj ), 'sneakpeak');
		};

});
