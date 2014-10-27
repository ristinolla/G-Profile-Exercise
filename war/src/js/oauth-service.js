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
