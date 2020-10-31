
const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    message: String,
    userReferences: [Number]
}, {
    timestamps: true
})

// Notifcation is an object.
    // Message
    // Ids for links to users
    // Timestamp

module.exports = notificationSchema