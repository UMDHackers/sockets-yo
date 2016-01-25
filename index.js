var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numberOnline = 0;
var users = [];
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  console.log("a user connected");

  socket.on('nickname', function(username){
      //users[socket.id] = msg;
      socket.username = username;
      users.push(username);
      numberOnline += 1;
      io.emit('welcome message', {
        usern: username,
        usersn: users
      });
      console.log('new user: ' + username + ' number online: ' + numberOnline.toString());
    //  console.log(users);
  });
  socket.on('chat message', function(msg){
    //var user = users[socket.id] + ": ";
    io.emit('chat message', socket.username+ ": " +msg);
    console.log(socket.username+ ": " +msg);
  });
  socket.on('typ', function (){
    io.emit('typing', socket.username);
    //console.log(socket.username + " typing");
  });

  socket.on('disconnect', function(){
    console.log(socket.username + ' disconnected');
    var index = users.indexOf(socket.username);
    delete users[index];
    numberOnline -= 1;
    io.emit("left", socket.username);
  });
});
http.listen(3000, function() {
  console.log('listening on 3000');
});
