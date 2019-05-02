angular.module('fifaApp')
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