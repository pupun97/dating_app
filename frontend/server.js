/**
 * Created by abhiroop on 5/6/14.
 */

var express = require('express'),
  http = require('http'),
  passport = require('passport'),
  morgan = require('morgan'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  LocalStrategy = require('passport-local').Strategy,
  serverStatic = require('serve-static');
let rp = require("request-promise");


var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server,{pingTimeout: 6000000});
app.use(morgan());
app.use(compress());
app.use(bodyParser());


app.use(methodOverride());
app.use(cookieParser());


app.use('/', serverStatic(__dirname + '/app'));


app.get('/api/team', function(req, res) {
  rp('http://127.0.0.1:5002/image').then(function(resp){
    res.send(resp)
  },function(err){
    if(err.statusCode){
          return res.status(err.statusCode).send(err);
        } 
        else {
          return res.send(err);
        }
  })
});

app.post('/api/login', function(req, res, next) {
  auth = "Basic " + new Buffer(req.body.username + ":" + req.body.password).toString("base64");
  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:5002/login',
    body: {
    },
    headers : {
            "Authorization" : auth
        }
    ,
    json: true // Automatically stringifies the body to JSON
  };
 
  rp(options)
      .then(function (resp) {
          // POST succeeded...
          console.log(resp)
          res.send(resp)
      })
      .catch(function (err) {
          // POST failed...
          console.log(err.message,'error while loging from server')
          res.status(401).send(err)
      });
});

app.get('/api/session', function(req, res) {
  console.log(req.headers.authorization,'\n\n\n')
  if(req.headers.authorization){
    res.send({
    loginStatus: true,
    user: req.user
  });
  }
  else{
    res.status(404).send('please Authorization yourself')
  } 
  
  
});


app.post('/api/register', function(req, res, next) {
  auth = "Basic " + new Buffer(req.body.username + ":" + req.body.password).toString("base64");
  var options = {
    method: 'POST',
    uri: 'http://127.0.0.1:5002/register',
    body: {
        img:req.body.image_link,
    },
    headers : {
            "Authorization" : auth
        }
    ,
    json: true // Automatically stringifies the body to JSON
  };
   
  rp(options)
      .then(function (resp) {
          // POST succeeded...
          console.log(resp,'+++++++++++++++++++++++++++++++')
          res.send(resp)
      })
      .catch(function (err) {
        // POST failed...
        console.log(err.statusCode,'---------------------------\n\n\n\n\n\n')
        if(err.statusCode){
          return res.status(err.statusCode).send(err);
        } else {
          return res.send(err);
        }
    });
});

app.post('/api/like',function(req,res,next){
  console.log(req.headers.authorization,'asasasasasaasasasasas')
  var userEmail=req.body.userEmail;
  console.log('request is receiving',userEmail)
  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:5002/like',
    body: {
      'userEmail':userEmail
    },
    headers : {
            "Authorization" : req.headers.authorization
        }
    ,
    json: true // Automatically stringifies the body to JSON
  };
  rp(options).then(function(success){
    res.send(success);
  },function(err){
    if(err.statusCode){
          return res.status(err.statusCode).send(err);
        } 
        else {
          return res.send(err);
        }
  })
});

app.post('/api/image',function(req,res,next){
  console.log(req.body.image,req.body)
  res.send('good image');
})

var users={}
var client_name={}
var port = process.env.PORT || 8000;

console.log('Please go to http://localhost:' + port);

io.sockets.on('connection', function (client) {
  user_name=client.handshake.query.name
  users[user_name]=client;
  client_name[client.id]=user_name

  io.sockets.emit('new_user',{users:Object.keys(users)})

  console.log('connection establish with',user_name,'\n\n\n\n')
  console.log(user_name,'connected\n\n\n\n')
  console.log('client id is',client.id)

  client.on('like', function(data) {
        console.log('like request coming from',data,'\n\n\n')
        var from = data.detail.from;
        var to=data.detail.to;
        console.log(from,'like photo of ',to,'\n\n\n');
        if(users[to]){
          users[to].emit('notify',{'from':from});  
        }
  }); 

  client.on('disconnect', function() {
    io.sockets.emit('user_disconnect',{user:client_name[client.id]})
    console.log("disconnected",client.id,client_name[client.id])
    delete users[client_name[client.id]]
    delete client_name[client.id]
    });
});

server.listen(port);