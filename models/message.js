const mongoose = require('mongoose');
const User = require('./user')

const messageSchema = mongoose.Schema({
    time: {type: Date , default: Date.now()},
    date: {type: Date, default: Date.now()},
    heading:{type:String}, 
    text: {type: String, required:true},
    Author: {type: mongoose.SchemaTypes.ObjectId , ref:'Users'}
})

module.exports = mongoose.model("messages", messageSchema);