// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
  .factory('SocketService', ['socketFactory', function SocketService(socketFactory) {
    var socketFactory={
        Socket: function(userName){
          if(userName){
            return io.connect('http://localhost:8000',{query:{'name':userName}}) 
          }
          else{
            return false;
          } 
        }
    };
    return socketFactory;
  }])
  .factory('FifaService', ['$http',
    function($http) {
      return {
        getTeams: function() {
          return $http.get('/api/team');
        },

        getTeamDetails: function(code) {
          return $http.get('/api/team/' + code);
        }
      }
  }])
  .factory('UserService', ['$http','$location','$route', function($http,$location,$route) {
    var service = {
      isLoggedIn: false,
      current_user:"",
      session: function() {
        return $http.get('/api/session')
              .then(function(response) {
          service.isLoggedIn = true;
          return response;
        },function(err){
            service.isLoggedIn = false;
            $location.path('/login');
            $location.replace();
        });
      },

      login: function(user,register=false) {
        var url='api/login'
        if(register){
          url='api/register'
        }
        return $http.post(url, user) 
          .then(function(response) {
            service.isLoggedIn = true;
            sessionStorage.setItem('token',response.data.token)
            sessionStorage.setItem('expire_time',response.data.duration)
            sessionStorage.setItem('current_user',response.data.user.email)
            $location.path('/');
            return response;
        });
      },
      register: function(user){
        return $http.post('/api/register', user) 
          .then(function(response) {
            service.isLoggedIn = true;
            sessionStorage.setItem('token',success.data.token)
            sessionStorage.setItem('expire_time',success.data.duration)
            $location.path('/');
            return response;
        }); 
      },
      logout: function(){
        service.isLoggedIn = false;
        sessionStorage.clear();
        $route.reload();
      }
    };
    return service;
  }]);
