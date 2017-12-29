console.log('Begin')

var http = require('http');

var server = http.createServer(function(req, res){

}).listen(5000, 'localhost');

var mySocket = require('socket.io').listen(server);
// console.log(mySocket);
mySocket.on('connection', function (socket){
    console.log("New user connected");
    var currentUserID = undefined;
    socket.on('join_room', function(response){
        socket.join('chat_room');
        var allUsers = [1, 2, 3, 4];
        for(i in allUsers){
            var chotiID = undefined, badiID = undefined;

            if(response.user_id > allUsers[i]) {
                chotiID = allUsers[i];
                badiID = response.user_id;
            }else if(response.user_id < allUsers[i]){
                chotiID = response.user_id;
                badiID = allUsers[i];
            }else{

            }
            var room = String(chotiID) + '_' + String(badiID);
            socket.join(room);
            console.log('room joined', room);
        }

        console.log("hello", mySocket.sockets.adapter.rooms['chat_room']);
        console.log("user Joined", response);
        mySocket.in('chat_room').emit('user_joined', response);
        currentUserID = response.user_id;
    });

    socket.on('disconnect', function(){
        console.log('User Disconnected', currentUserID);
        console.log("hello", mySocket.sockets.adapter.rooms['chat_room']);
        mySocket.in('chat_room').emit('user_left', {user_id: currentUserID})
    });

    socket.on('message_sent', function(response){
        console.log('Message Received by Server', response);
        var room = undefined;
        if(response.receiver_id) {
            if (response.sender_id < response.receiver_id)
                room = String(response.sender_id) + '_' + String(response.receiver_id);
            else
                room = String(response.receiver_id) + '_' + String(response.sender_id);
        }else
            room = 'chat_room';

        console.log("Message emitted in room", room);
        mySocket.in(room).emit('message_received', response);
        console.log('Ack Sent by Server', response);
    });

});

console.log('End');