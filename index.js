var express = require('express');
var socket = require('socket.io');

// Setup server.
var app = express();
var port = 4000;

// Middleware.
// Static files.
app.use(express.static('public'));

var server = app.listen(port, function() {
  console.log("Listening on port " + port);
})

// Setup the socket from the constructor, passing it the server that we setup above.
// The socket will watch the server and check to see if any clients make a connection to it.
// When a client makes a connection to the server it will open, and keep open, a socket.
var io = socket(server);

// Setup the action when a connection is made. Via a listener which will listen for a 'connection' event.
// Then the callback function will be run and the invidual socket (between that specific client and server)
// is passed to it as an arg.
io.on('connection', function(socket) {
  console.log('Connection is made on socket ' + socket.id);

  // Setup a listener that will be triggered when a newmessage event is emitted from the client.
  socket.on('newmessage', function(messageData) {
    // The sockets.emit call will run the listener callback functions of all the sockets that are connected via this server.
    // All clients will then receive this data and can update the browser accordingly.
    io.sockets.emit('newmessage', messageData);
  });

  // If a user is typing into the message box the client side socket will emit a typing event call.
  // The client emit passes the username of the typer to the callback.
  socket.on('typing', function(username) {
    // We then want to broadcast this fact to all other users who are connected to the socket so that their browsers can update.
    // A broadcast goes to all other users but not to the socket that emitted the event.
    socket.broadcast.emit('typing', username);
  });

});
