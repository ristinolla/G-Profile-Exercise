/*
 *
 *
 *
*/

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileCtrl', function($scope, ApiService, OauthService) {

		$scope.profile = {};


		console.log('Profile ctrl');

		if(OauthService.isSignedIn === true){
			ApiService.getProfile().then(function( data ){
				console.log('Profile object', data);

				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];

			});

			ApiService.getPeople().then(function( data ){
				console.log('People object', data);
				$scope.people = data;
			});
		} else {
			console.log('dd');
		}


});
