app.factory('friends', ['$http', function($http){

  var friendsService = {

    users: [],

    getUsers: function(){
      return $http.get('/users').then(function(data){
        angular.copy(data.data, friendsService.users);
        console.log(friendsService.users);
      });
    }
  };
 
return friendsService;

}]);