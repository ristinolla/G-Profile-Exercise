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
