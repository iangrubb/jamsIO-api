
module.exports = configureMongo = () => {

    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/jamsIO', {useNewUrlParser: true});

    const userSchema = require('./schemas/user')

    return {
        User: mongoose.model('User', userSchema)
    }

}

