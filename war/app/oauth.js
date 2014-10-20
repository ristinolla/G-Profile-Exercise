/***
** Note by Perttu: this based on: https://github.com/googleplus/gplus-quickstart-java
**
**/
var oauth = (function() {
  var authResult;

  return {
    /**
     * Hides the sign-in button and connects the server-side app after
     * the user successfully signs in.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {

      if (authResult.access_token) {

        // The user is signed in
        this.authResult = authResult;
        oauth.connectServer();
        $('#gConnect').hide();
        
      } else if (authResult.error) {
        // There was an error, which means the user is not signed in.
        // As an example, you can troubleshoot by writing to the console:
        console.log('There was an error: ' + authResult.error);
      }
      //console.log('authResult: ', authResult);
    },

    /**
     * Calls the server endpoint to disconnect the app for the user.
     */
    disconnectServer: function() {
      // Revoke the server tokens
      $.ajax({
        type: 'POST',
        url: window.location.href + 'disconnect',
        async: false,
        data: {"token": oauth.authResult.code },
        success: function(result) {
          console.log('revoke response: ' + result);
        },
        error: function(e) {
          console.log(e);
        }
      });
    },
    /**
     * Calls the server endpoint to connect the app for the user. The client
     * sends the one-time authorization code to the server and the server
     * exchanges the code for its own tokens to use for offline API access.
     * For more information, see:
     *   https://developers.google.com/+/web/signin/server-side-flow
     */
    connectServer: function() {
      //console.log(this.authResult.code);
      $.ajax({
        type: 'POST',
        url: window.location.href + 'connect?state=' + STATE,
        contentType: 'application/octet-stream; charset=utf-8',
        success: function(result) {
          console.log("result:", result);
          //renderer.getProfile();
        },
        error: function(e) {
          console.log(e);
        },
        processData: false,
        data: this.authResult.code
      });
    }

  };
})();
