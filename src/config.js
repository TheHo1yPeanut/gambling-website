const mongoose = require("mongoose");
const { type } = require("os");
const connect = mongoose.connect('YOURSTRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


connect.then(() => {
    console.log("connection");
}).catch(() => {
    console.log("failed to connect");
});


const loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
});


const userModel = new mongoose.model("users", loginSchema);
module.exports = {userModel};