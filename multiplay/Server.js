let redis = require('redis');
let client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

let Player = require('./Player');
let Lobby = require('./Lobby');

module.exports = class Server {
    constructor(){
        this.serverId = '';
        this.SOCKETS = [];
        this.PLAYERS = [];
        this.LOBBIES = [];
    }

    onConnected(socket){
        let server = this;
        let player = new Player(''+Math.random()); //Player(socket.request.session.userId);
        server.SOCKETS[player.id] = socket;
        server.PLAYERS[player.id] = player;

        console.log('Player '+player.id+' Connected.');
        socket.emit('register',{id:player.id});
        this.emitPlayerList(socket);

        socket.on('invitePlayer',function(data){
            server.SOCKETS[data.opId].emit('invitation',{opId:player.id});
        });

        socket.on('inviteAccept', function(data){
            let playersToJoin = [];
            let socketsToJion = [];
            playersToJoin[data.opId] = server.PLAYERS[data.opId];
            playersToJoin[player.id] = server.PLAYERS[player.id];
            socketsToJion[data.opId] = server.SOCKETS[data.opId];
            socketsToJion[player.id] = server.SOCKETS[player.id];
            server.createLobby(playersToJoin,socketsToJion);
        });

        socket.on('inviteReject', function(data){
            server.SOCKETS[data.opId].emit('toast',{msg:'Invitation Rejected!'})
        });

        socket.on('readyToStart',function(){
            server.PLAYERS[player.id].updateReadyStatus(true);
            server.LOBBIES[player.lobbyId].checkReady();
        })

        socket.on('updatePosition',function(data){
            player.updatePosition(data.position);
            player.updateRotation(data.rotation);
        });

        socket.on('leaveLobby',function(){
            server.LOBBIES[player.lobbyId].removePlayer(player.id);
        })

        socket.on('disconnect',function(){
            console.log('Player '+player.id+' Disconnected!');
            delete server.SOCKETS[player.id];
            delete server.PLAYERS[player.id];
        });
    }

    emitPlayerList(socket){
        let server = this;
        setInterval(function(){
            let playersPack = {};
            for(let id in server.PLAYERS){
                let data = {
                    id : id,
                    username : server.PLAYERS[id].username,
                    lobbyId : server.PLAYERS[id].lobbyId,
                    status : server.PLAYERS[id].status,
                    readyStatus : server.PLAYERS[id].readyStatus,
                }
                playersPack[id] = data;
            }
            //console.log(playersPack);
            socket.emit('updatePlayerList',{players : playersPack});
        },1000/1);
    }

    createLobby(playersToJoin, socketsToJion){
        let server = this;
        let lobby = new Lobby();
        server.LOBBIES[lobby.id] = lobby;
        lobby.joinLobby(playersToJoin, socketsToJion);
    }

}