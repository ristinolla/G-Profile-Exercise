
/**
* Calls the helper method that handles the authentication flow.
*
* @param {Object} authResult An Object which contains the access token and
*   other authentication information.
*/
function onSignInCallback(authResult) {
	oauth.onSignInCallback(authResult);
}

/**
* Perform jQuery initialization and check to ensure that you updated your
* client ID.
*/
$(document).ready(function() {
	$('#disconnect').on('click', oauth.disconnectServer);
});
