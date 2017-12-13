console.log('Begin')

var http = require('http');


var server = http.createServer(function(req, res){

}).listen(5000, 'localhost');

var mySocket = require('socket.io').listen(server);
// console.log(mySocket);
mySocket.on('connection', function (socket){
    // console.log(socket);
    console.log("New user connected");
    var current_user = undefined;
    socket.on('join_room', function(data){
        socket.join('chat_room');
        console.log("user Joined", data);
        mySocket.in('chat_room').emit('user_joined', data)
        current_user = data;
    });

    socket.on('disconnect', function(){
        console.log('User Disconnected', current_user);
        mySocket.in('chat_room').emit('user_left', current_user)
    });

    socket.on('message_sent', function(response){
        console.log('Message Received by Server', response);
        mySocket.in('chat_room').emit('message_received', response);
        console.log('Ack Sent by Server', response);
    });

});

console.log('End')