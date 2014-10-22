/**


**/
var app = angular.module('profileApp', [
	'profileControllers',
	'loginController'
]);

/*

app.config(['$routeProvider',
  function($routeProvider) {
		console.log('Routerprovider started');

    $routeProvider.
      when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl'
      }).

			when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).


      otherwise({
        redirectTo: '/login'
      });
}]);
*/
