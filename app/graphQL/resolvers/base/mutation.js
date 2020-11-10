const User = require('../../../models/user')
const Jams = require('../../../models/jams')
const Follow = require('../../../models/follow')

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
        refreshSpotify: (_parent, args, context) => {
            return User.refreshSpotify(context, args)
        },
        updateJams: (_parent, args, context) => {
            return Jams.update(context, args)
        },
        followUser: (_parent, args, context) => {
            return Follow.add(context, {followeeId: parseInt(args.followeeId)})
        },
        unfollowUser: (_parent, args, context) => {
            return Follow.remove(context, {followeeId: parseInt(args.followeeId)})
        }
    }
}