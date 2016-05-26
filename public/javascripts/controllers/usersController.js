app.controller('UsersCtrl', ['$scope', 'friends', 'auth', function($scope, friends, auth){

  $scope.users = friends.users; //from friends.js, comes here and  the data is displayed now in the template
     console.log($scope.users);

  $scope.currentUser = auth.currentUser();  //invokes and checks fnc in app.js to see for current user and then set in template not to display it.
     console.log($scope.currentUser);
      
//if users and current user are already friends then display the remove button
//if not friends then display the add friends.
//want to compare the current user id to user.friends array id`s.
//user is from the users arrray in users.html.it loops thru them and dispaly each individualy
  $scope.isFriend = function(user){ //one of the displayed users
  
    for(var i = 0; i<user.friends.length; i++){ //loop thru the displayed users friends array
      if(user.friends[i] === $scope.currentUser._id) { //user.friends array is only id`s compare to the id of teh currently logged in user
        console.log(user.friends);

        return true;  //if find matching ids then return true and the remove button displays.
      }
    }
  }
}]);
//controller controles the template and u can set up scopes here.