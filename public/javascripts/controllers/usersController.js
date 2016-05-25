app.controller('UsersCtrl', ['$scope', 'friends', 'auth', function($scope, friends, auth){

    $scope.users = friends.users; //from friends.js, comes here and  the data is displayed now in the template
      console.log($scope.users);

  $scope.currentUser = auth.currentUser();  //invokes and checks fnc in app.js to see for current user and then set in template not to display it.
      console.log($scope.currentUser);
      

  var isFriend = function(user){
    for(var i = 0; i<length; i++){
      if($scope.currentUser._id == users.friends._id){

          }
    }
  }


}]);

//controller controles the template and u can set up scopes here.