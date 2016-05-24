app.factory('friends', ['$http', function($http){

  var friendsService = {

    users: [],

    getUsers: function(user){
      return $http.get('/users').then(function(data){
        angular.copy(data.data, friendsService.users);
        console.log(data.data);

        //dont display current logged in user
      });
    }

  //   getUser: function(user){
  //     return $http.get()
  //   }
  };


 
return friendsService;

}]);