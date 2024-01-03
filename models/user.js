const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, minLength:2, required: true},
    username: {type: String, required:true, minLength:5},
    password: {type:String, required:true, minLength:6},
    isMember: {type:Boolean},
})


module.exports = mongoose.model("Users", userSchema);