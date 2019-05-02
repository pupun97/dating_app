// File: chapter10/routing-example/app/scripts/controllers.js
angular.module('fifaApp')
  .controller('MainCtrl', ['UserService',
    function(UserService) {
      var self = this;
      self.userService = UserService;
            // Check if the user is logged in when the application
      // loads
      // User Service will automatically update isLoggedIn
      // after this call finishes
      UserService.session();
  }])

  .controller('TeamListCtrl', ['FifaService','$http','localStorageService','SocketService','UserService','$scope',
    function(FifaService,$http,localStorageService,SocketService,UserService,$scope) {
      var self = this;
      self.userName=sessionStorage.getItem('current_user')
      UserService.current_user=sessionStorage.getItem('current_user')
      self.socket = SocketService.Socket(self.userName)
      // $rootScope.current_user=sessionStorage('current_user')
      console.log(UserService.current_user)
      FifaService.getTeams().then(function(resp) {
        self.users = resp.data;
        console.log(self.users)
      });

      self.like_photo=function(userEmail){
          self.users.data[userEmail].likes+=1;

          self.socket.emit('like', { detail: {'to':userEmail,'from':self.userName} });
          // $http.post('/api/like',{'userEmail':userEmail}).then(
          //   function(success){
          //   },function(err){
          //     alert(err);
          //   });
          
      }
      self.update_online_user=function(online_users){
        for(name in online_users){
          self.users.data[online_users[name]].isOnline=true;
        } 
      }
      self.socket.on('notify',function(data){
        alert('you gotlike ')
        console.log(data,'like data')
      })

      self.socket.on('new_user',function(data){
        self.online_user=data.users
        self.message='i am online'
        self.update_online_user(self.online_user)
        $scope.$apply()
        console.log(data)
      })
      self.socket.on('user_disconnect',function(data){
        self.users.data[data.user].isOnline=false
        $scope.$apply()
        console.log(data)
      })


  }])

  .controller('LoginCtrl', ['UserService', '$location',
    function(UserService, $location) {
      var self = this;
      (function ($) {
          "use strict";

          
          /*==================================================================
          [ Validate ]*/
          var input = $('.validate-input .input100');

          $('.validate-form').on('submit',function(){
              var check = true;

              for(var i=0; i<input.length; i++) {
                  if(validate(input[i]) == false){
                      showValidate(input[i]);
                      check=false;
                  }
              }

              return check;
          });


          $('.validate-form .input100').each(function(){
              $(this).focus(function(){
                 hideValidate(this);
              });
          });

          function validate (input) {
              if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                  if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                      return false;
                  }
              }
              else {
                  if($(input).val().trim() == ''){
                      return false;
                  }
              }
          }

          function showValidate(input) {
              var thisAlert = $(input).parent();

              $(thisAlert).addClass('alert-validate');
          }

          function hideValidate(input) {
              var thisAlert = $(input).parent();

              $(thisAlert).removeClass('alert-validate');
          }
          
          

      })(jQuery);
      
      self.register_user;
      self.user = {username: '', password: ''};
      self.register_true=function(){
        self.register_user=true;
      }

      self.login = function() {
        UserService.login(self.user,self.register_user).then(function(success) {
          alert('login succesfully')
        }, function(error) {
          alert('username or password invalid')
          // $location.path('/ram');
          self.errorMessage = error.data.msg; 
        })
      };
     
  }])

  .controller('registerCtrl',
    ['$location', '$routeParams', 'FifaService','$http',
    function($location, $routeParams, FifaService,$http) {
      var self = this;
      self.team = {};
      self.readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
      }
      $("#imgfile").on("change", function(event){
        self.user_image=event.target.files[0]
        $http.post('/api/image',{'image':self.user_image}).then(
            function(success){
              console.log(success);
            },function(err){
              alert(err);
            });
        self.readURL(this);
        console.log(self.file)
      });
      
    }]);
