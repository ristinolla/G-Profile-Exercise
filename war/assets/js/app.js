/**


**/
var app = angular.module('profileApp', [
	'profileControllers'
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
		console.log('ApiService.getProfile');
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
		console.log('ApiService.getPeople');
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


		$scope.showProfile = function() {
			ApiService.getProfile().then(function( data ){
				console.log('Profile object', data);
				$scope.profile = data;
				$scope.profile.image.bigUrl = data.image.url.split("?")[0];

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




});
