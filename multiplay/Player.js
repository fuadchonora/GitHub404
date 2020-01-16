module.exports = class Player {
    constructor(userId){
        this.id = userId;
        this.username = 'user'+userId;
        this.lobbyId = null;
        this.status = 'in-online';
        this.readyStatus = false;
        this.position;
        this.rotation;
    }

    updatePosition(position){
        this.position = position;
    }

    updateRotation(rotation){
        this.rotation = rotation;
    }

    updateStatus(status){ // in-online | in-lobby | in-search | in-match
        this.status = status;
    }

    updateReadyStatus(status){ //true or false
        this.readyStatus = status;
    }

    updateLobbyId(lobbyId){ // null if not in room
        this.lobbyId = lobbyId; 
    }
}