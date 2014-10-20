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
