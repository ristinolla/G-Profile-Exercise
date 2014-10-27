/*
 * Profile controller
 * - Handles the login flow too
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

		// Get profile information from Google using ApiService.js
		// This sets the data for scope and then renders profile data
		$scope.showProfile = function() {
			ApiService.getProfile().then(function( data ){
				console.log('Profile object', data);
				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];
				$scope.profile.homeTown = getCurrentCity( $scope.profile );
				$scope.urlTypes();
			});

			ApiService.getPeople().then(function( data ){
				console.log('People object', data);
				$scope.people = data;
			});
		};



		// Handle disconnect from app
		// This function is triggered when disconnect button is pressed
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
			// this takes care of the
			// http://stackoverflow.com/questions/23020733/google-login-hitting-twice

			if( authResult.status.method === "AUTO" &&
					authResult.status.signed_in &&
					authResult.status.google_logged_in
				){
					console.log('ayto');
					$scope.isSignedIn = true;
					$scope.showProfile();
					return;
			}

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


		// Google login button maker
		$scope.login = function(){
			var additionalParams = {
		     'callback': $scope.signIn
		  };
			gapi.auth.signIn( additionalParams );
		};



		// Revealcontent function
		// Dependencies: classie.js
		$scope.revealContent = function(obj, $event){
			classie.addClass( $event.srcElement, 'hide' );
			classie.removeClass(document.getElementById( obj ), 'sneakpeak');
		};



		// Regex URL type for better displaying
		$scope.urlTypes = function(){

			if(!$scope.profile.urls) {
				return;
			}

			// This is not an exhaustive list at all..
			var patterns = [
				{ pattern: 'twitter', 			service: 'twitter'},
				{ pattern: 'linkedin.com', 	service: 'linkedin'},
				{ pattern: 'last.fm', 			service: 'lastfm'},
				{ pattern: 'facebook', 			service: 'facebook'}
			];

			// Loop urls and compare each url value to patterns
			for(var i in $scope.profile.urls){
				for(var k in patterns){
					var n = $scope.profile.urls[i].value.indexOf(patterns[k].pattern);
					if( n !== -1 ) {
						$scope.profile.urls[i].service = patterns[k].service;
					}
				}
			}
		};

});
