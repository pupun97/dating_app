angular.module('fifaApp')
  .controller('registerCtrl',
    ['$location', '$routeParams', 'FifaService','$http',
    function($location, $routeParams, FifaService,$http) {
      var self = this;
      self.team = {};
      self.user={}
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