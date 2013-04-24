var socket = io.connect('http://basic-app.hollieburgess90.c9.io');


// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function() {
    var userId = $('input#userId').val();
   // call the server-side function 'adduser' and send one parameter (value of prompt)
   console.log("Adding "+userId);
   socket.emit('adduser', userId);
   $('#chatRow').show();
    $('#chatRowWaiting').hide();
});
// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function(username, data) {
    console.log(data);
    if (data.state === "warning") {
       $('#conversation').append('<div style="color:red"><b>' + username + ':</b> ' + data.message + '</div><br>');
    } else {
        $('#conversation').append('<b>' + username + ':</b> ' + data.message + '<br>');   
    }
});
// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
   $('#users').empty();
   $.each(data, function(key, value) {
        $('#users').append('<div>' + value + '</div>');
   });
});
// on load of page
$(function() {
    $('#chatRow').hide();
    $('#chatRowWaiting').show();
   // when the client clicks SEND
   $('#datasend').click(function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
   });
   // when the client hits ENTER on their keyboard
   $('#data').keypress(function(e) {
        if (e.which == 13) {
             $(this).blur();
             $('#datasend').focus().click();
        }
   });
});