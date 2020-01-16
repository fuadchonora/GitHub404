let io = require('socket.io')(8001);
console.log('\033[32m'+'Socket.io Server running at port %d: http://%s:%d'+'\033[0m',8001,'localhost',8001);


let SOCKET_LIST = {};

io.on('connection', function(socket){
    socket.id = ""+Math.random();
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id+"  Connected From Multiplay.js");

    socket.emit('register',{playerId:socket.id});

    socket.on('updatePosition',function(data){
        SOCKET_LIST[socket.id].position = data.position;
        SOCKET_LIST[socket.id].rotation = data.rotation;
        console.log(socket.id+' -> Position( X:'+data.position.x+' Y:'+data.position.y+' Z:'+data.position.z+')  |  Rotation( X:'+data.rotation.x+' Y:'+data.rotation.y+' Z:'+data.rotation.z+')');
    });
    console.log(socket.id+"  disconnected");

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
    });

});

setInterval(function(){
    let pack = {};
    for(let i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];
        pack[SOCKET_LIST[i].id]={
            position:socket.position,
            rotation:socket.rotation,
        };
    }

    io.emit('updatePositions',pack);
},1000/60);