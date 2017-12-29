// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

function main(){
    var socket = io.connect('http://localhost:5000');
    // var current_user_email = document.getElementById('current_user_email');
    var currentUserID = undefined;
    if($('.my-profile-card')[0])
        currentUserID = Number($('.my-profile-card').attr('id').slice(5));
    if(currentUserID) {
        console.log('User logged in');
        // current_user_email = current_user_email.innerText;
        // currentUserID = currentUserID[0].firstElementChild.id;

        socket.on('connect', function () {
            socket.emit('join_room', {user_id: currentUserID});
        });

        socket.on('user_left', function (response) {
            if (response) {
                console.log(response, " left the room");
                var data = {
                    user_id: response.user_id
                };
                // Remove member <email> from List
                $.ajax({
                    url: 'users/remove',
                    method: 'POST',
                    data: data,
                    success: function () {
                        console.log("Successfully Removed User", data);
                    },
                    error: function () {
                        console.log("Error Removing member", data);
                    }
                });
            }
        });

        socket.on('user_joined', function (response) {
            if(response.user_id != currentUserID){
                console.log(response, ' Joined');
                // Add member <email> to the list
                var data = {
                    user_id: response.user_id
                };
                $.ajax({
                    url: 'users/add',
                    method: 'POST',
                    data: data,
                    success: function () {
                        console.log('Successfully added member ', response, ' to List');
                    },
                    error: function () {
                        console.log('Error adding member ', response, ' to List');
                    }
                });
            }
        });

        $('#send_0').click(function(event){
            console.log(event);
            event.preventDefault();
            data = {
                sender_id: currentUserID,
                receiver_id: undefined,
                message: $('#send_0')[0].previousElementSibling.firstElementChild.value
            };
            if(data.message != ''){
                console.log('Message Sent by Client', data);
                $.ajax({
                    url: 'message/create',
                    method: 'POST',
                    data: data,
                    success: function (message) {
                        console.log("Message Saved", message.id);
                        $('#send_0')[0].previousElementSibling.firstElementChild.value = '';
                        var response = {
                            message_id: message.id,
                            receiver_id: undefined,
                            sender_id: currentUserID
                        };
                        socket.emit('message_sent', response);
                    },
                    error: function () {
                        console.log("Error in Saving Message")
                    }
                });
            }

        });

        socket.on('message_received', function(response){
            console.log('Ack Received by Client', response);
            // Show Message in Chat Box
            var data = {
                message_id: response.message_id,
                receiver_id: response.receiver_id,
                sender_id: response.sender_id
            };
            $.ajax({
                url: 'message/add',
                method: 'POST',
                data: data,
                success: function(){
                    console.log("Message Added")
                },
                error: function(){
                    console.log("Error in Adding Message")
                }
            })
        })

    };

}

window.addEventListener('load', function(){
    main();
});

// window.onunload = function(){
//     console.log("unload called");
//     localStorage['abc'] = 'pqr';
//     $.ajax({
//         url: 'users/sign_out',
//         method: 'DELETE',
//         success: function(){},
//         error: function(){}
//     });
// }