var profileApp = angular.module('profileApp', []);

profileApp.controller('ProfileCtrl', function ($scope, $http) {
  $http.get('profile').success(function(data) {
    $scope.profile = data;
  });
});
