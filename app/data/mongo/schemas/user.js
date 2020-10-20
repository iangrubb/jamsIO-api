const { Mongoose } = require("mongoose");

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: Number,
    currentJamIds: [String]
})

// Add methods here if needed

module.exports = userSchema