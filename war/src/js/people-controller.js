/*
* Profile controller
* - simple controller to show all peoples in profiles circles
*
*/

var peopleController = angular.module('peopleController', []);

peopleController.controller('PeopleCtrl', function($scope, ApiService, $location) {

	$scope.people = {};

	ApiService.getPeople().then(function(data){
		$scope.people = data;
	}, function(response){
		console.log(response);
		$location.path('/login');
	});

});
