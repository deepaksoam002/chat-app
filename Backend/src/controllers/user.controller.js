const User = require('../models/user.models.js');
const connection = require('../models/connection.models.js');
const { searchWithEmail, searchWithUsername } = require('../utils/contactQuery.js');



const handleNewConnection = async (req, res) => {

    try {
        const { currentUserId, targetUserId } = req.body

        // validation checks
        if (!currentUserId || !targetUserId) {
            const missingField = !currentUserId ? "userId" : "contactId";
            return res.status(401).json({ error: "Bad Request", message: "missing required field", field: "missingField" });
        }


        // check first in user collection for id exist or not 
        const requestedId = [currentUserId, targetUserId];
        const foundUsers = await User.find({ _id: { $in: requestedId } }, { _id: 1 });  // getting only ids
        const foundIdToString = foundUsers.map(user => user.id.toString());    // convert id in string 
        const missingId = requestedId.filter(id => !foundIdToString.includes(id));  // finding id which is not in usercollection

        if (missingId.length > 0) {

            res.status(404).json({

                success: false,
                message: "Connection failed because user records were not found.",
                missingUsers: missingIds
            });
        };


        // Before creating a new entry, See if a connection ALREADY exists in either direction

        const existConnection = await connection.findOne({
            $or: [
                { user: currentUserId, connectedWith: targetUserId },
                { user: targetUserId, connectedWith: currentUserId }
            ]
        });

        // if connection already exist then simple return existconnection 
        if (existConnection) {

            return res.status(409).json({
                success: false,
                message: "A connection between these two users already exists.",
                data: existConnection
            })
        }

        // if connection not exist then create a socketId and new entry in collection 
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        const roomId = `${currentUserId}_${targetUserId}_${randomNum}`;

        const newConnection = new connection({
            user: currentUserId,
            connectedWith: targetUserId,
            roomID: roomId
        });

        await newConnection.save();

        return res.status(201).json({
            success: true,
            message: "Connection established successfully!",
            data: newConnection
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }

}

const handleConnection = async (req, res) => {

   try {
     const currentUserId = req.user.id;
 
 
     const response = await connection.find({ $or: [{ user: currentUserId }, { connectedWith: currentUserId }] })
         .populate("user", "username email").populate("connectedWith", "username email");
 
 
     return res.status(200).json({ connections: response });
   } catch (error) {

    console.log("Error Function handleConnection :", error);
    throw new Error("unable to fetch connections")
    
   }

}

const handleGetUserQuery = async (req, res) => {

    try {

        const query = req.params.query;

        if (query.includes('@') && query.includes('.')) {

            const data = await searchWithEmail(query);

            if (!data) {
                return res.status(404).json({ message: "User not found" });
            }

            const { email, username, _id } = data;

            res.status(200).json({ email, username, _id });


        } else {


            const data = await searchWithUsername(query)

            if (!data) {
                return res.status(404).json({ message: "User not found" });
            }
            const { email, username, _id } = data;

            res.status(200).json({ email, username, _id });
        }
    } 
    
    catch (error) {

        console.error("Error : ", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

module.exports = {
    handleNewConnection,
    handleConnection,
    handleGetUserQuery,
}