
module.exports = configureMongo = () => {

    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/jamsIO', {useNewUrlParser: true});

    const userSchema = require('./schemas/user')
    const notificationSchema = require('./schemas/notification')

    return {
        User: mongoose.model('User', userSchema),
        Notification: mongoose.model('Notification', notificationSchema)
    }

}

