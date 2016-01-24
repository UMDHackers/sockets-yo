var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numberOnline = 0;
var users = {};
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  console.log("a user connected");
  numberOnline += 1;
  socket.on('nickname', function(msg){
      users[socket.id] = msg;

      io.emit('welcome message', msg);
      console.log('new user: ' + msg + ' number online: ' + numberOnline.toString());
      console.log(users);
  });
  socket.on('chat message', function(msg){
    var user = users[socket.id] + ": ";
    io.emit('chat message', user+msg);
    console.log(user + ': '+msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnect');
    numberOnline -= 1;
  });
});
http.listen(3000, function() {
  console.log('listening on 3000');
});
