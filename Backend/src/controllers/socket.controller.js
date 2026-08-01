

const Client = require('../db/redis/index')


// helper function to get unread messages from redis 
async function getUnreadMessages(patternKey) {

    let cursor = 0;
    const matchPattren = patternKey;
    let result = [];

    // here we use do while loop because this loop run atlest one time if cursor value !=0 then it will continoue looping untill cursoe == 0 ;

    try {

        do {

            const [nextCursor, keys] = await Client.scan(cursor, 'MATCH', matchPattren, 'COUNT', 30)

            cursor = nextCursor

            if (keys.length > 0) {

                const batchPromises = keys.map((key) => Client.lrange(key, 0, -1));
                const responseArray = await Promise.all(batchPromises);

                result.push(...responseArray.flat());
            }
        } while (cursor !== '0');

        return result;

    } catch (error) {

        console.error("Error fetching offline messages:", error);
        throw error;
    }
}

function establishedaConnectionBetweenClientAndRecipient(roomId, socket) {

    socket.join(roomId);
    console.log(`${socket?.user?.username || "user"} join room successfully` )

}

async function setUserOnlineInRedis(socket) {

    const user = socket?.user;

    try {
        await Client.hset("Online_User", user?.id, socket?.id)
        console.log(`${user.username} mark as online in redis`)

    } catch (error) {

        console.log("Unable to set user in Redis", error)
        return null
    }

}


async function sendUnreadMessages(socket) {

    try {
        const user = socket?.user;
        const keyPattern = `User:${user?.id}:*`;

        const data = await getUnreadMessages(keyPattern);

        if (data && data.length > 0) {
            const parsedMessages = data.reduce((acc, msg) => {

                try {

                    const parsed = typeof msg === "string" ? JSON.parse(msg) : msg;
                    const roomID = Array.isArray(parsed) ? parsed[0].room : parsed?.room;

                    if (!acc[roomID]) {
                        acc[roomID] = []
                    }

                    acc[roomID].push(parsed)
                }
                catch (error) {
                    console.error("Failed to parse message entry:", error.message);
                }

                return acc;
            }, {});

            const keysLength = Object.keys(parsedMessages).length

            if (keysLength > 0) {
                console.log(`parsed message send to ${socket.user.username}`)
                socket.emit("unread_Message", parsedMessages);
            }
        };

    } catch (error) {

        console.log("Redis operation failed during sendMessage :", error);
        return null;
    }

}

async function setUserOfflineInRedis(socket) {

    try {
        const user = socket?.user

        const response = await Client.hdel("Online_User", user?.id)
        if (response === 1) {
            console.log(`User ${user.username || user.id} removed successfully.`);
            return true;
        } else {
            console.log(`User ${user.username || user.id} was not active in Redis.`);
            return false;
        }
    }
    catch (error) {
        console.log("Redis Error : ", error);
        return false
    }
}

async function sendMessageToRecipient(message, socket) {


    try {
        const recipientId = message?.recipientId;

        const response = await Client.hget("Online_User", recipientId)

        if (response) {

            socket.to(message.room).emit("receive_message", message);
            console.log(`message send successfull to user${recipientId}`);

            // Todo : need to send conformation message back to sender
        }
        else {
            // if user currently offline  then we save messages in redis list as a queue
            try {
                const response = await Client.rpush(`User:${recipientId}:${message.room}`, JSON.stringify(message))
                if (!response) {

                    console.log(`Redis Error : Message push failed`)
                    return false;
                    // Todo :  we can add a retry function to push message again or else send a failed message to client 
                } else {

                    console.log(` message push successfully`)

                    // Todo :  here we can send message status to  client that message save in server but pending to send recipient

                }
            } catch (error) {

                console.log("Redis operation failed during message push in list")
                return false;


            }
        }

    }
    catch (error) {

        console.log("Redis operation failed during sendMessage :", error);
    }
}

async function removeReadMessageFromUnreadRedisQueue(data, socket) {

    try {
        console.log(`remove message from redis queue for user ${socket?.user?.username || "user"}`)
        const user = socket?.user
        const key = `User:${user?.id}:${data?.roomId}`
        const response = await Client.del(key)

        if (response !== 0) {

            console.log(`response from redis delete operation : ${response}`)

            console.log(`key ${key} do not exist in redis`);
            return false;
        }

        console.log(`message remove successfully from redis `)
        return true;

    } catch (error) {

        console.log(`Redis operation failed`, error);
        return false;

    }
}

function sendMessageStatusToSender(data, socket){

    const rooms = data.room;
    const status = data.status;

    socket.to(rooms).emit("message-state", status)
}

module.exports = {
    setUserOnlineInRedis,
    sendUnreadMessages,
    setUserOfflineInRedis,
    sendMessageToRecipient,
    removeReadMessageFromUnreadRedisQueue,
    establishedaConnectionBetweenClientAndRecipient,
    sendMessageStatusToSender
}