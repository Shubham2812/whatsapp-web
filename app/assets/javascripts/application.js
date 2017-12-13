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
    var current_user_email = document.getElementById('current_user_email');
    if(current_user_email) {
        console.log('User logged in');
        current_user_email = current_user_email.innerText;

        socket.on('connect', function () {
            socket.emit('join_room', {email: current_user_email});
        });

        socket.on('user_left', function (data) {
            if (data) {
                console.log(data, " left the room");
                // Remove member <email> from List
                $.ajax({
                    url: 'users/remove',
                    method: 'POST',
                    data: data,
                    success: function () {
                        console.log("Success");
                    },
                    error: function () {
                        console.log("Error Removing member", data.email);
                    }
                });
            }
        });

        socket.on('user_joined', function (data) {
            if(data && data.email != current_user_email){
                console.log(data, ' Joined');
                // Add member <email> to the list
                $.ajax({
                    url: 'users/add',
                    method: 'POST',
                    data: data,
                    success: function () {
                        console.log("Success");
                    },
                    error: function () {
                        console.log('Error adding member ' + data.email + ' to List');
                    }
                });
            }
        });

        $('#send_0').click(function(event){
            console.log(event);
            event.preventDefault();
            data = {
                sender_email: current_user_email,
                receiver_id: undefined,
                message: $('#send_0').siblings()[1].value
            };
            if(data.message != ''){
                var message_id = undefined;
                console.log('Message Sent by Client', data);
                $.ajax({
                    url: 'message/create',
                    method: 'POST',
                    data: data,
                    // contentType:false,
                    // cache: false,
                    // processData:false,
                    success: function (message) {
                        console.log("Message Saved", message.id)
                        $('#message').val('');
                        message_id = message.id;
                        var response = {
                            message_id: message.id,
                            receiver_id: undefined
                        }
                        socket.emit('message_sent', response);
                    },
                    error: function () {
                        console.log("Error in Saving Message")
                    }
                });
            }

        });
        $('#send_2').click(function(event){
           event.preventDefault();
           console.log("Send_2 Clicked");
           data = {
               sender_email: current_user_email,
               receiver_id: 2,
               message: $('#send_2').siblings()[1].value
           }

           if(data.message != ''){
               var message_id = undefined
               console.log('Message Sent by Client', data);
               $.ajax({
                   url: 'message/create',
                   method: 'POST',
                   data: data,
                   contentType:false,
                   cache: false,
                   processData:false,
                   success: function (message) {
                       console.log("Message Saved", message.id)
                       $('#message').val('');
                       message_id = message.id
                       var response = {
                           message_id: message.id,
                           receiver_id: 2
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
            data = {
                message_id: response.message_id,
                receiver_id: response.receiver_id
            };
            $.ajax({
                url: 'message/add',
                method: 'POST',
                data: data,
                success: function(){
                    console.log("Message Saved")
                },
                error: function(){
                    console.log("Error in Saving Message")
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