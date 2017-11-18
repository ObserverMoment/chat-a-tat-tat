// Using the 'io' object that is provided in the client side socket io javascript package
// We can setup a connection with the server side socket.
// The server side socket is listening for a 'connection' event, which will trigger its callback function.
// The connect function here will emit a connection broadcast / trigger the callbacks that are listed under
// the 'connection' attribute in the event emitter object.
var socket = io.connect("http://localhost:4000");

// Get the elements from the DOM that you will need for the chat app.
var handle = document.getElementById('handle');
var message = document.getElementById('message');
var send = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

// When the send button is clicked you will need to connect to the socket and send the info that has been entered.
send.addEventListener('click', function() {
  // When the send button is clicked you should emit an event from the client socket
  // Which can be sent through the socket to trigger a function on the server socket. Call this whatever you want.
  // The second parameter is data that the call back will be passed, in this case, name and message.
  socket.emit('newmessage', {
    handle: handle.value,
    message: message.value
  });
});

// In order to tell the other chat users when someone else is typing we can emit a message to the socket
// when keys are being pressed in the message input field.
message.addEventListener('keypress', function() {
  // Emit a 'typing' event which will trigger a callback server side.
  // Pass the typer's name so that this info can be conveyed to the other users.
  socket.emit('typing', handle.value);
});

socket.on('newmessage', function(messageData) {
  feedback.innerHTML = "";
  output.innerHTML += `<p><b>${messageData.handle}</b> says: ${messageData.message}</p>`;
});

socket.on('typing', function(username) {
  feedback.innerHTML = `<p><em>${username} is typing...</em></p>`;
})
