const User = require('../../../models/user')
const Jams = require('../../../models/jams')
const Follow = require('../../../models/follow')
const { compareSync } = require('bcryptjs')

module.exports = {
    Mutation: {
        signup: (_parent, args, context) => {
            return User.signup(context, args)
        },
        login: (_parent, args, context) => {
            return User.login(context, args)
        },
        autoLogin: (_parent, _args, context) => {
            return User.autoLogin(context)
        },
        authenticateSpotify: (_parent, args, context) => {
            return User.authenticateSpotify(context, args)
        },
        updateJams: (_parent, args, context) => {
            return Jams.update(args, context)
        },
        followUser: (_parent, args, context) => {
            return Follow.add(args, context)
        },
        unfollowUser: (_parent, args, context) => {
            return Follow.remove(args, context)
        }
    }
}