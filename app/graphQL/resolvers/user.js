const User = require('../../models/user')

module.exports = {
    User: {
        currentJams: (user, _args, context) => User.currentJams(context, user)
    },
    AuthPayload: {

    }
}