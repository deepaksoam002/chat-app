const dotenv = require('dotenv');
const { createServer } = require('http');
const app = require('./app.js');
const initSocket = require('./socket.js');
const ConnectDB = require('./db/mongodb/index.js');

dotenv.config({ path: './.env'}) 


const server = createServer(app);
const port = process.env.PORT || 8001;


initSocket(server);  // pass server to socket

ConnectDB().then(() => {

    server.listen(port, () => {
        console.log(`Server is running at port : ${port}`);
    })
}).catch((error) => {

    console.log("Mongodb Connection Failed !!", error);
})





