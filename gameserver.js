let express = require('express');
let httpServer = require("http").Server;
let app = express();
let httpserver = httpServer(app);
let io = require('socket.io')(httpserver);

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
    //console.log('user called /')
    res.sendFile(__dirname+'/public/index.html');
})

let Server = require('./multiplay/Server');

let server = new Server();

io.on('connection',function(socket){
    server.onConnected(socket);
})

httpserver.listen(5000,function(){
    console.log('server started.');
});