// authored completely by Perttu
/*
var renderer = (function() {
  return {
    renderProfile: function(argument) {
      
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        
          //profile.renderer(profile);
          
          $('#profile').empty();
          if (profile.error) {
            console.log(profile.error)
            return;
          }
          console.log(profile);
          //$('#profile').append( $('<p><img src=\"' + profile.image.url + '\"></p>') );
          //var profileApp = angular.module('profileApp', []);
          //
          //profileApp.controller('ProfileCtrl', function ($scope) {
          //  $scope.profiles = [profile, profile];
          //});

        });
      $('#gConnect').hide();
    }

  }
})();
*/