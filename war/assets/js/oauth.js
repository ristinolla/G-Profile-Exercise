/***
** Note by Perttu: This is modified from: https://github.com/googleplus/gplus-quickstart-java
** 
**/

var helper = (function() {
  var authResult = undefined;
  
  return {
    /**
     * Hides the sign-in button and connects the server-side app after
     * the user successfully signs in.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {

      if (authResult['access_token']) {

        // The user is signed in
        this.authResult = authResult;
        
        //TODO: do the servers side if needed....
        helper.connectServer();
        
        // After we load the Google+ API, render the profile data from Google+.
        gapi.client.load('plus','v1', this.getProfile);

      } else if (authResult['error']) {
        // There was an error, which means the user is not signed in.
        // As an example, you can troubleshoot by writing to the console:
        console.log('There was an error: ' + authResult['error']);
      }
      console.log('authResult: ', authResult);
    },

    /**
     * Retrieves the authenticated user's Google+ profile.
     */
    getProfile: function() {
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      console.log(request);
      $('#gConnect').hide();
    },
    /**
     * Calls the server endpoint to disconnect the app for the user.
     */
    disconnectServer: function() {
      // Revoke the server tokens
      console.log('disconnect process');
      $.ajax({
        type: 'POST',
        url: window.location.href + 'disconnect',
        async: false,
        data: {"token": helper.authResult.code },
        success: function(result) {
          console.log('revoke response: ' + result);
          $('#authOps').hide();
          $('#profile').empty();
          $('#visiblePeople').empty();
          $('#authResult').empty();
          $('#gConnect').show();
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
      console.log(this.authResult.code);
      $.ajax({
        type: 'POST',
        url: window.location.href + 'connect?state=' + STATE,
        contentType: 'application/octet-stream; charset=utf-8',
        success: function(result) {
          console.log("result:", result);
          helper.people();
        },
        error: function(e) {
          console.log(e);
        },
        processData: false,
        data: this.authResult.code
      });
    },
    /**
     * Calls the server endpoint to get the list of people visible to this app.
     */
    people: function() {
      $.ajax({
        type: 'GET',
        url: window.location.href + 'people',
        contentType: 'application/octet-stream; charset=utf-8',
        success: function(result) {
          helper.appendCircled(result);
        },
        processData: false
      });
    },
    /**
     * Displays visible People retrieved from server.
     *
     * @param {Object} people A list of Google+ Person resources.
     */
    appendCircled: function(people) {
      $('#visiblePeople').empty();
  
      $('#visiblePeople').append('Number of people visible to this app: ' +
          people.totalItems + '<br/>');
      for (var personIndex in people.items) {
        person = people.items[personIndex];
        $('#visiblePeople').append('<img src="' + person.image.url + '">');
      }
    },
  };
})();
  
