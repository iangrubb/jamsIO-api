
const User = require('../../../models/user')

module.exports = {
    Query: {
        users: (_parent, _args, context) => User.findAll(context)
    }
}