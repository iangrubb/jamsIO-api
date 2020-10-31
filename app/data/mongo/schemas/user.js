const { Mongoose } = require("mongoose");

const mongoose = require('mongoose')

const notificationSchema = require('./notification')

const userSchema = new mongoose.Schema({
    _id: Number,
    currentJamIds: [String],
    notifications: [notificationSchema],
    listenedTrackIds: [String]
})


// Add methods here if needed

module.exports = userSchema