module.exports = class Lobby {
    constructor(){
        this.id = 'lobby-'+Math.random();
        this.gameMode = 'classic';
        this.status = 'in-ready';
        this.sockets = [];
        this.players = [];
    }

    joinLobby(playersToJoin, socketsToJion){
        let lobby = this;
        let px = 0;
        let py = 0;
        let pz = 0;
        let rx = 0;
        let ry = 0;
        let rz = 0;
        for(let id in playersToJoin){
            lobby.players[id] = playersToJoin[id];
            lobby.sockets[id] = socketsToJion[id];
            lobby.players[id].updatePosition({x:px,y:py,z:pz});
            lobby.players[id].updateRotation({x:rx,y:ry,z:rz});
            lobby.players[id].updateStatus('in-lobby');
            lobby.players[id].updateLobbyId(lobby.id);
            console.log(id+' Joined '+lobby.id);
            px += 100;
            py += 0;
        }
        lobby.updateReadyList();
    }

    removePlayer(id){
        let lobby = this;
        lobby.players[id].updateReadyStatus(false);
        lobby.players[id].updateStatus('in-online');
        lobby.players[id].updateLobbyId(null);
        lobby.players.pop(lobby.players[id]);
        lobby.sockets.pop(lobby.sockets[id]);
    }

    readyToStart(player){
        let lobby = this;
        let players = lobby.players;
        players[player.id].updateReadyStatus(true);
        console.log('inside Ready status is :'+player.readyStatus);
    }

    updateReadyList(){
        let lobby = this;
        setInterval(function(){
            if(lobby.status != 'in-ready'){
                return;
            }
            let readyList = {};
            for(let id in lobby.players){
                var data = {
                    id : id,
                    readyStatus : lobby.players[id].readyStatus,
                }
                readyList[id] = data;
            }
            for(let id in lobby.sockets){
                lobby.sockets[id].emit('updateReadyList',{players:readyList});
            }
        },1000/2);
    }

    checkReady(){
        let lobby = this;
        let players = [];
        for(let id in lobby.players){
            players.push(lobby.players[id].readyStatus);
        }
        let isReady = false;
        isReady = players.every(function(status) {
            return status === true;
        });
        if(isReady === true){
            lobby.startGame();
        }
    }

    //checkReadyStatus

    startGame(){
        let lobby = this;
        lobby.status = 'in-started';
        lobby.spwnPlayers();

        setInterval(function(){
            if(lobby.status !== 'in-started'){
                return;
            }
            //create pack with updating data of all sockets in the lobby
            let dataPack = {};
            for(let id in lobby.players){
                let data = {
                    id:id,
                    position: lobby.players[id].position,
                    rotation: lobby.players[id].rotation,
                };
                dataPack[id] = data;
            }
            //send dataPack to all sockets in the lobby
            for(let id in lobby.sockets){
                let socket = lobby.sockets[id];
                socket.emit('updatePositions',dataPack);
                //console.log('eminting to '+id);
            }
        },1000/30);
    }

    spwnPlayers(){
        let lobby = this;
        let spawnPack = {};
        for(let id in lobby.players){
            let data = {
                id:id,
                position: lobby.players[id].position,
                rotation: lobby.players[id].rotation,
            };
            spawnPack[id] = data;
        }
        //spawn players
        for(let id in lobby.sockets){
            let socket = lobby.sockets[id];
            socket.emit('spawnPlayers',spawnPack);
        }
    }
}