//let io = require('./app');
// const io = require('socket.io')(8088);
// const redis = require('socket.io-redis');
// io.adapter(redis({ host: 'localhost', port: 6379 }));
// const GlobalIoEmitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

let express = require('express');
let httpServer = require("http").Server;
let app = express();
let httpserver = httpServer(app);
let io = require('socket.io')(httpserver);
app.get('/',(req,res)=>{
    //console.log('user called /')
    res.sendFile(__dirname+'/index.html');
})


let Server = require('./multiplay/Server');

let server = new Server();

io.on('connection',function(socket){
    server.onConnected(socket);
})

// let socket = {key:'a'}
// server.onConnected(socket);
// socket = {key:'b'}
// server.onConnected(socket);

// let playersToJoin = [];
// let socketsToJion = [];
// for(let  id in server.PLAYERS){
//     playersToJoin[id] = server.PLAYERS[id];
//     socketsToJion[id] = server.SOCKETS[id];
// }
// server.createLobby(playersToJoin, socketsToJion);

// for(let lobbyId in server.LOBBIES){
//     for(let playerId in server.LOBBIES[lobbyId].players){
//         server.LOBBIES[lobbyId].readyToStart(server.LOBBIES[lobbyId].players[playerId]);
//         console.log('Player Ready :'+server.LOBBIES[lobbyId].players[playerId].id);
//     }
// }

// for(let id in server.PLAYERS){
//     console.log('Outside Ready status is :'+server.PLAYERS[id].readyStatus);
// }

//console.log(server.LOBBIES)

httpserver.listen(8788,function(){
    console.log('server started.');
});