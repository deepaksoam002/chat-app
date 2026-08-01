const mongoose = require('mongoose');


const ConnectDB = async () => {

    try {

        const connectionInstance = mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log(" Mongodb Connected Successfully !!")

    }
    catch (error) {

        console.error("Mongodb Connection Failed !!")
        process.exit(1);
    }

}  


module.exports = ConnectDB;