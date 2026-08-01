const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const authentication = require('./middlewares/authentication');


function initSocket(server) {

    // cors setup ----
    const IO = new Server(server, {
        cors: ({
            origin: 'http://localhost:5173',
            methods: ["GET", "POST"],
            credentials: true,
        })
    });


    // middleware setup ----
    IO.engine.use(cookieParser());
    IO.use(authentication.socketAuthMiddleware);



    IO.on("connection", (socket) => {

   
        // import all socket controllers
        const {
            setUserOnlineInRedis,
            sendUnreadMessages,
            setUserOfflineInRedis,
            sendMessageToRecipient,
            removeReadMessageFromUnreadRedisQueue,
            establishedaConnectionBetweenClientAndRecipient,
            sendMessageStatusToSender
        } = require('./controllers/socket.controller.js');


    setUserOnlineInRedis(socket); // set client as online in redis 
    sendUnreadMessages(socket);  // check for unread messages and send to client 


    // socket events 
    socket.on('disconnect', () => setUserOfflineInRedis(socket));
    socket.on("sendMessagefromClient", (message) => sendMessageToRecipient(message, socket));
    socket.on("mask_as_read", (data) => removeReadMessageFromUnreadRedisQueue(data, socket));
    socket.on("join_room", (roomName) => establishedaConnectionBetweenClientAndRecipient(roomName, socket));
    socket.on("message_status",(data) => { sendMessageStatusToSender(data,socket)})
    


})

}


module.exports = initSocket;