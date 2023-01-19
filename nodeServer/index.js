//Node server which will handle sockets io connections
const io = require('socket.io')(8001,{
    cors:{
        origin:"*"
    }
})



const users = {};

io.on('connection', socket=>{
    //if new user joins then let other users, connected to the server know.
    socket.on('new-user-joined', name =>{
        //console.log("new user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    // If someone sends a message broadcast it to others.
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]});
    });

    //If someone leaves the chat let other know.
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
}) 