/*
* Profile controller
* - simple controller to show all peoples in profiles circles
*
*/

var peopleController = angular.module('peopleController', []);

peopleController.controller('PeopleCtrl', function($scope, ApiService) {

	$scope.people = {};

	ApiService.getPeople().then(function(data){
		console.log(data);
		$scope.people = data;
	});

});
