const User = require('../../../models/user')

module.exports = {
    Mutation: {
        signup: (_parent, args, context) => {
            return User.signup(context, args)
        },
        login: (_parent, args, context) => {
            return User.login(context, args)
        },
    }
}