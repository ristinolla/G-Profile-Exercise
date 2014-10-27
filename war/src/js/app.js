/**
 Main configuration file for angular app
**/


var app = angular.module('profileApp', [
	'ngRoute',
	'profileControllers',
	'peopleController'
]);


app.config(['$routeProvider',
  function($routeProvider) {
		console.log('Routerprovider started');

    $routeProvider.
      when('/profile', {
        templateUrl: 'partials/profile-view.html',
        controller: 'ProfileCtrl'
      }).

			when('/people', {
        templateUrl: 'partials/people.html',
        controller: 'PeopleCtrl'
      }).

      otherwise({
        redirectTo: '/profile'
      });
}]);
