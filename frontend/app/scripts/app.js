// File: chapter10/routing-example/app/scripts/app.js
const app = angular.module('fifaApp', ['ngRoute','LocalStorageModule', 'btford.socket-io'])
  .config(function($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'views/team_list.html',
      controller: 'TeamListCtrl as teamListCtrl',
      resolve: {
        auth: ['$q', '$location', 'UserService',
          function($q, $location, UserService) {
             return UserService.session().then(
               function(success) {},
               function(err) {
                  $location.path('/login')
                  return $q.reject(err);
             });
        }]
      },
    })
    .when('/login', {
      templateUrl: 'views/login.html'
    })
    .when('/register',{
      templateUrl:'views/register.html',
      controller: 'registerCtrl as Ctrl'
    });
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  })
  app.config(['$httpProvider', function ($httpProvider) {  
        $httpProvider.interceptors.push('AuthInterceptor');  
    }])
  app.factory('AuthInterceptor', ['$log', '$q', function ($log, $q) {  
        $log.debug('$log is here to show you that this is a regular factory with injection');  
  
        var authInterceptor = {  
            request: function (config) {  
                var accessToken = sessionStorage.getItem('token');  
                if (accessToken == null || accessToken == "undefined") {  
                    // $state.go("login");
                    console.log('accessToken is not available ')  
                }  
                else {  
                    config.headers["Authorization"] = "bearer " + accessToken;  
                }  
                return config;  
            },  
        };  
  
        return authInterceptor;  
    }]);  