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

      otherwise({
        redirectTo: '/login'
      });
}]);

/*
 * Api Service
 *
*/

app.service("ApiService", function($http, $q){

	// --------------
	// Public Methods
	// --------------
	var ApiService = {};

	// POST requests login information to the server,
	// where ConnectServlet.java handles the server connection to google
	ApiService.connect = function( authResult ){
		var request = $http({
					method: "post",
					url: "/api/connect?state=" + STATE,
					data: authResult.code,
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	};


	// POSTS the disconnect method
	ApiService.disconnect = function( authResult ){
		var request = $http({
					method: "post",
					url: "/api/disconnect",
					data: {"token": authResult.code },
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	};


	// GET Profile from java backend
	// Returns json object from /api/profile
	// on error 401 "Current user not connected." display error message
	ApiService.getProfile = function( authResult ){
		var request = $http({
					method: "get",
					url: "/api/profile",
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	};


	// GET Profile from java backend
	// Returns json object from /api/people
	// on error 401 "Current user not connected." display error message
	ApiService.getPeople = function( authResult ){
		var request = $http({
					method: "get",
					url: "/api/people",
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	};



	// ---------------
	// Private methods
	// ---------------

	// Converts the data if not an object to an simpler unknown form
	function handleError( response ) {
		if ( ! angular.isObject( response.data ) || ! response.data.message) {

				return( $q.reject( response.data ) );
		}
		// Otherwise, use expected error message.
		return( $q.reject( response.data.message ) );

	}

	function handleSuccess( response ) {
				//console.log(response.data);
				return( response.data );
	}

	return ApiService;
});

/*
* Oauth Service
*
*/

app.factory("OauthService", function($http, $q, ApiService){


	var OauthService = {};

	// --------------
	// Private Methods
	// --------------

	var immediateFailed = false,
	 		authResult = {};


	// --------------
	// Public Methods
	// --------------

	OauthService.isSignedIn = false;

	// processAuth handles the authenticaction to the server side
	/* Returns an object:
			{
				signedIn: true/false,
				message: "Why succes or error"
			}
	*/
	OauthService.processAuth = function( authResult ) {

			var deferred = $q.defer();

			if (this.isSignedIn) {
				deferred.resolve({
					signedIn: true,
					message: "Already signed in."
				});
			}

			// Access_token is provided by client:plusone.js api.
			if (authResult.access_token) {
				this.immediateFailed = false;

				// Successfully authorized, create session
				ApiService.connect(authResult).then(function( result ) {
					console.log('Login succesfull, status: ', result);
					deferred.resolve({
						signedIn: true,
						message: result
					});
				},
					function( reason ){
						console.log('Connection failed because: ', reason);
						deferred.resolve({
							signedIn: false,
							message: reason
						});
					}
				);

				// If the Google api had an error then present the error.
			} else if (authResult.error) {
				// checks if the immediate login can be done
				if (authResult.error === 'immediate_failed') {

					this.immediateFailed = true;
					deferred.resolve({
						signedIn: false,
						message: "Immediate Connection failed"
					});

				} else {
					console.log('severe amount of shit in the fan');

					deferred.resolve({
						signedIn: false,
						message: authResult.error
					});

				}
			}

			return deferred.promise;
	}; // end processAuth


	// Handles the disconnect side
	OauthService.disconnect = function(authResult){
		var deferred = $q.defer();

		ApiService.disconnect( authResult ).then(function(result){
				this.isSignedIn = false;

				deferred.resolve({
					signedOut: true,
					message: result
				});

		});

		return deferred.promise;
	};

	return OauthService;


});

/*
* Login controller
* - Handles the login flow too
*
*/

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', function($scope, $location, ApiService, OauthService, $rootScope) {



	var init = function(){
		console.log("rootscopeauth: ", $rootScope.authResult);
		if(!$rootScope.authResult){
			$rootScope.isSignedIn = false;
		} else if($scope.authResult.status.signed_in){
			$rootScope.isSignedIn = true;
		}
	};

	init();

	// The call back function for the button.
	var signIn = function( authResult ) {

		$scope.authResult = authResult;
		$rootScope.authResult = authResult;
		// Autosign in
		if( authResult.status.method === "AUTO" &&
				authResult.status.signed_in &&
				authResult.status.google_logged_in
			){
				$scope.isSignedIn = true;
				$location.path('/profile');
				return;
		}

		// Callback fired everytime signIn status changes
		// this takes care of the
		// http://stackoverflow.com/questions/23020733/google-login-hitting-twice
		if( authResult.status.method !== "PROMPT" ) {
			return;
		}

		$scope.$apply(function() {


			OauthService.processAuth( authResult )
				.then(function( result ){
					console.log(result);

					// Tests if signed in worked or not
					if(result.signedIn === true){
						$scope.isSignedIn = true;
						$location.path('/profile');

					} else {
						$scope.isSignedIn = false;
						console.log(result.message);

					}

				});
		});
	};




	// Google login button maker
	//
	$scope.login = function(){
		var additionalParams = {
			'callback': signIn
		};
		gapi.auth.signIn( additionalParams );
	};


	// Handle disconnect from app
	// This function is triggered when disconnect button is pressed
	$scope.disconnect = function (){
		OauthService.disconnect( $rootScope.authResult )
			.then(function( result ){
				gapi.auth.signOut();
				$rootScope.isSignedIn = false;
		});
	};


});

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

				urlTypes();

			}, function(response){
				$location.path('/login');
			});

			//Get people
			ApiService.getPeople().then(function( data ){
				$scope.people = data;
			}, function(response){

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
		$scope.disconnect = function (){
			console.log($rootScope.authResult);
			OauthService.disconnect( $rootScope.authResult )
				.then(function( result ){
					gapi.auth.signOut();
					$rootScope.isSignedIn = false;
					$location.path('/login');
			});
		};

});

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
