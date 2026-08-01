const { Schema, model } = require('mongoose');
const { randomBytes, createHmac } = require('crypto')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,

    },
    refreshTokenVersion: {
        type: String,
        required: true
    }
}, { timestamps: true });


// hash password befor save in data base.........

userSchema.pre("save", async function () {
    try {


        const user = this;

        if (!user.isModified("password")) return;

        const salt = randomBytes(16).toString();
        const hashPassword = createHmac('sha256', salt).update(user.password).digest("hex");

        user.salt = salt;
        user.password = hashPassword;
       

    } catch (error) {

        console.error(" message :", error);
        throw new Error("Failed to hash password");
    }

});



userSchema.static("matchPasswordAndReturnToken", async function (email, password) {

    try {

        const user = await this.findOne({ email });

        if (!user) throw new Error('Invalid Email or Password');


        const salt = user.salt;
        const hashPassword = user.password;

        const userProvidedHashPassword = createHmac("sha256", salt).update(password).digest("hex");

        if (hashPassword !== userProvidedHashPassword) throw new Error('Invalid Email or Password');

        const userId = user._id.toString();
        const userEmail = user.email;
        const userName = user.username;
        
        const payload = { email:userEmail, username:userName, _id: userId };
        

        return payload

    }
    catch (error) {

        console.error("Error in matchPasswordAndReturnToken:", error);
        throw new Error("Failed to match password and return token");
    }

})


module.exports = model('User', userSchema);