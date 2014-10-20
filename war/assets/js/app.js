/**


**/
var app = angular.module('profileApp', []);

/*
 * Api Service
 *
*/

app.service("ApiService", function($http, $q){


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
		console.log('disconnect in services');
		var request = $http({
					method: "post",
					url: "/api/disconnect",
					data: {"token": authResult.code },
					contentType: 'application/octet-stream; charset=utf-8'
				});

		return (request.then(handleSuccess, handleError ));
	}


	// Private methods
	// ---------------
	function handleError( response ) {
		if ( ! angular.isObject( response.data ) || ! response.data.message) {
				return( $q.reject( "An unknown error occurred." ) );
		}
		// Otherwise, use expected error message.
		return( $q.reject( response.data.message ) );

	}

	function handleSuccess( response ) {
				console.log(response.data);
				return( response.data );
	}

	return({
		connect: connect,
		disconnect: disconnect
	});
});

/**
 *
 *
 *
 *
 */

app.controller('OauthCtrl', function ($scope, $http, ApiService) {

  $scope.isSignedIn = false;
  $scope.immediateFailed = false;
  $scope.authResult = {};


  $scope.data = {
    'callback': $scope.signIn,
    'clientid': '391956554891-0spjspmirtm07e9l9tsjl1ntkdpcmle5.apps.googleusercontent.com',
    'requestvisibleactions': 'http://schemas.google.com/AddActivity',
    'scope': 'https://www.googleapis.com/auth/plus.login',
    'theme': 'dark',
    'cookiepolicy': 'single_host_origin',
    'accesstype': 'offline'
  };

  $scope.signedIn = function(profile) {
    $scope.isSignedIn = true;
    //$scope.userProfile = profile;
    console.log('Signed In');
  };

  $scope.sendSignIn = function (authResult){
    return $http.post('/api/connect', authResult);
  };

  $scope.signIn = function(authResult) {
    $scope.$apply(function() {
      /*if(authResult.status.signed_in){
        $scope.isSignedIn = true;
      }*/
      $scope.authResult = authResult;
      console.log('Authresult: ', authResult);
      $scope.processAuth(authResult);
    });
  };


  $scope.processAuth = function(authResult) {
    $scope.immediateFailed = true;
    if ($scope.isSignedIn) {
      return 0;
    }
    if (authResult.access_token) {
      $scope.immediateFailed = false;

      // Successfully authorized, create session
      ApiService.connect(authResult).then(function(response) {
        $scope.signedIn(response.data);
      },
        function(reason){
          console.log('Connection failed because: ', reason);
        }
      );
    } else if (authResult.error) {
      // checks if the immediate login can be done
      if (authResult.error === 'immediate_failed') {
        console.log('Immediate Connection failed');
        $scope.immediateFailed = true;
      } else {
        console.log('Error:' + authResult.error);
      }
    }
  };


  $scope.renderSignIn = function() {
    return gapi.signin.render('myGsignin', {
      'callback': $scope.signIn,
      'clientid': '391956554891-0spjspmirtm07e9l9tsjl1ntkdpcmle5.apps.googleusercontent.com',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'theme': 'dark',
      'cookiepolicy': 'single_host_origin',
      'accesstype': 'offline'
    });
  };

  $scope.signOut = function (){
    console.log('signOut in controller', $scope.authResult);
    ApiService.disconnect( $scope.authResult);
  };


}); // End Oauth Ctrl
