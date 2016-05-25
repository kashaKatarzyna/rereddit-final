app.factory('friends', ['$http', function($http){

  var friendsService = {

    users: [],

//client side getting the users, invokes get request on server side
//first fnc to be invoked when we go to users url
    getUsers: function(){
      return $http.get('/users').then(function(data){  //then goes to app.js and invokes the promise, when raedy returns the users from server to ...
        angular.copy(data.data, friendsService.users);  //the friendsservice.users array is populated with all teh users. this fnc is invoked from app.js after all the users are back and ready to display
        console.log(data.data); //then need to display it, thats the controllers job now...
      });
    }
  };

return friendsService;

}]);