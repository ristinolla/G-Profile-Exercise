/**
 * Login CTRL
 * - Handles the authentication between Google OAUTH and Java Backend
 * Dependencies: ApiServies
 *
 */

// Login CTRL
var loginController = angular.module('loginController', []);


loginController.controller('LoginCtrl', function ($scope, ApiService, OauthService) {

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
    console.log(this);
    $scope.$apply(function() {

      $scope.authResult = authResult;

      OauthService.processAuth(authResult)
        .then(function( result ){
          console.log(result);

          // Tests if signed in worked or not
          if(result.signedIn === true){
            $scope.isSignedIn = true;
            //$scope.showProfile();
            //$routerProvider.redirectTo("/profile");
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
    // ggg
  };


  // Renders the Google+ sign in button
  // Dependencies: https://apis.google.com/js/client:plusone.js
  // TODO: Clientid retrieved from clients_secrets.json, this is not dynamic...
  $scope.renderSignIn = function() {
    return gapi.signin.render('gPlusSignIn', {
      'callback': $scope.signIn,
      'clientid': '391956554891-0spjspmirtm07e9l9tsjl1ntkdpcmle5.apps.googleusercontent.com',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      //'scope': 'https://www.googleapis.com/auth/plus.login',
      'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
      'theme': 'dark',
      'cookiepolicy': 'single_host_origin',
      'accesstype': 'offline'
    });
  };

/* TODO
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
*/

}); // End of controller
