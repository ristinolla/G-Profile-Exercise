/*
 * Profile controller
 * - Handles the login flow too
 *
*/

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileCtrl', function($scope, ApiService, OauthService,$location, $rootScope) {


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
		var init = function() {

			ApiService.getProfile().then(function( data ){

				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];
				$scope.profile.homeTown = getCurrentCity( $scope.profile );

				if(!$scope.profile.cover){
					$scope.profile.coverPhoto.url = '/assets/img/fallback-cover.jpg';
					$scope.profile.coverPhoto.height = 600;
				}

				urlTypes();

			}, function(response){
				$location.path('/login');
			});

			//Get people
			ApiService.getPeople().then(function( data ){
				$scope.people = data;
			}, function(response){
				console.log('error fetching people',response);
			});
		};
		init();


		// Regex URL type for displaying an icon next to them
		var urlTypes = function(){

			if(!$scope.profile.urls) {
				return;
			}

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


		// Revealcontent function
		// Dependencies: classie.js
		$scope.revealContent = function(obj, $event){
			classie.addClass( $event.srcElement, 'hide' );
			classie.removeClass(document.getElementById( obj ), 'sneakpeak');
		};


		// Handle disconnect from app
		// This function is triggered when disconnect button is pressed
		// TODO: this might be better in login-controller...
		// TODO: own view?
		$scope.disconnect = function (){
			console.log($rootScope.authResult);
			OauthService.disconnect( $rootScope.authResult )
				.then(function( result ){
					gapi.auth.signOut();
					$location.path('/logout');

			});
		};

});
