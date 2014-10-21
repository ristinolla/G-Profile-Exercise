/**


**/
var app = angular.module('profileApp', []);

/*
 * Api Service
 *
*/

app.service("ApiService", function($http, $q){

	// --------------
	// Public Methods
	// --------------

	// POST requests login information to the server,
	// where ConnectServlet.java handles the server connection to google
	function connect( authResult ){
		var request = $http({
					method: "post",
					url: "/api/connect?state=" + STATE,
					data: authResult.code,
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	}


	// POSTS the disconnect method
	function disconnect( authResult ){
		console.log('Disconnext in services');
		var request = $http({
					method: "post",
					url: "/api/disconnect",
					data: {"token": authResult.access_token },
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	}


	// GET Profile from java backend
	// Returns json object from /api/profile
	// on error 401 "Current user not connected." display error message
	function getProfile( authResult ){
		console.log('ApiService.getProfile');
		var request = $http({
					method: "get",
					url: "/api/profile",
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	}


	// GET Profile from java backend
	// Returns json object from /api/people
	// on error 401 "Current user not connected." display error message
	function getPeople( authResult ){
		console.log('ApiService.getPeople');
		var request = $http({
					method: "get",
					url: "/api/people",
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	}



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

	return({
		connect: connect,
		disconnect: disconnect,
		getProfile: getProfile,
		getPeople: getPeople
	});
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


	var immediateFailed = false;
	var authResult = {};



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

/**
 * ProfileCtrl
 * - Handles the authentication between Google OAUTH and Java Backend
 * Dependencies: ApiServies
 *
 */

app.controller('ProfileCtrl', function ($scope, ApiService, OauthService) {

  $scope.isSignedIn = OauthService.isSignedIn;
  $scope.immediateFailed = false;
  $scope.authResult = {};
  $scope.errorMessage = false;

  $scope.profile = {};
  $scope.people = {};


  // Handle disconnect from app
  $scope.disconnect = function (){
    OauthService.disconnect( $scope.authResult )
      .then(function( result ){
        console.log(result);
        $scope.isSignedIn = false;
        $scope.profile = {};
        $scope.people = {};
      });
    //ApiService.disconnect( $scope.authResult);
  };

  // The call back function for the button.
  // Makes sure processAuth is called only once.
  $scope.signIn = function( authResult ) {
    // Describe what this does
    $scope.$apply(function() {
      $scope.authResult = authResult;

      OauthService.processAuth(authResult)
        .then(function( result ){
          console.log(result);

          // Tests if signed in worked or not
          if(result.signedIn === true){
            $scope.isSignedIn = true;
            $scope.showProfile();
          } else {
            $scope.isSignedIn = false;
            console.log(result.message);
            $scope.handleError(result);
          }
        });
    });
  };

  // Handles error messages
  $scope.handleError = function( result ) {
    // body...
    $scope.errorMessage = result.message;
  };


  // Renders the Google+ sign in button
  // Dependencies: https://apis.google.com/js/client:plusone.js
  // TODO: Clientid retrieved from clients_secrets.json, this is not dynamic...
  $scope.renderSignIn = function() {
    return gapi.signin.render('gPlusSignIn', {
      'callback': $scope.signIn,
      'clientid': '391956554891-0spjspmirtm07e9l9tsjl1ntkdpcmle5.apps.googleusercontent.com',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'theme': 'dark',
      'cookiepolicy': 'single_host_origin',
      'accesstype': 'offline'
    });
  };


  $scope.showProfile = function() {

    ApiService.getProfile().then(function( data ){
      console.log('Profile object', data);
      $scope.profile = data;
    });

    ApiService.getPeople().then(function( data ){
      console.log('People object', data);
      $scope.people = data;
    });
  };

}); // End of controller
