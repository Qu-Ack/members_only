const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    time: {type: Date , default: Date.getTime()},
    date: {type: Date, default: Date.now()},
    text: {type: String, required:true},
    Author: {type: mongoose.SchemaTypes.ObjectId}
})

module.exports = mongoose.model("messages", messageSchema);