
var config = require('./config.js');

//================================================================
//Express Server

var express = require('express');
var app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.origins('*:*');

app.get('/api/test',function(req,res,next){
  res.send('test');
});

console.log('Starting Express Server on : ' + config.httpport);
server.listen(config.httpport);

//================================================================





//================================================================
//Socket.io

var socket_rooms = {};

io.on('connection', function (socket) {
  console.log('a user connected',socket.id,socket.conn.remoteAddress);

  socket.on('disconnect', function(){
    console.log('user disconnected '+socket.id);
  });

  socket.on('editor_update', function (room,msg) {
    //console.log('received editor update',room,msg);
    socket.to(room).emit('editor_update',msg);
  });

  socket.on('join_room', function(room){
    //leave any room already joined
    if(socket_rooms[socket.id]){
      socket.leave(socket_rooms[socket.id]);
    }
    console.log('JOINING ROOM',room);
    socket.join(room);
    //set socket room to keep track
    socket_rooms[socket.id] = room;
  });

});//io.on('connection')

//================================================================

