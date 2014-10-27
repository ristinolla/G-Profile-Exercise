/**
 Main configuration file for angular app
**/


var app = angular.module('profileApp', [
	'ngRoute',
	'loginControllers',
	'profileControllers',
	'peopleController'
]);

app.run(['$rootScope', function($rootScope){
	$rootScope.authresult = false;
}]);


app.config(['$routeProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider.
      when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      }).

			when('/people', {
        templateUrl: 'views/people.html',
        controller: 'PeopleCtrl'
      }).

			when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			}).

			when('/logout', {
				templateUrl: 'views/logout.html'
			}).

      otherwise({
        redirectTo: '/login'
      });
}]);
