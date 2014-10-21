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
