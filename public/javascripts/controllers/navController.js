app.controller('NavCtrl', ['$scope', 'auth', 'friends', function($scope, auth, friends){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;


  friends.getUsers(); 
  $scope.users = friends.users;

     $scope.addFriend= function(){
          console.log("hey");
        }

}]);