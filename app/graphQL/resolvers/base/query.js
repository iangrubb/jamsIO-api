
const User = require('../../../models/user')
const Track = require('../../../models/track')

module.exports = {
    Query: {
        currentUser: (_parent, _args, context) => User.current(context),
        findUser: (_parent, args, context) => User.findById(parseInt(args.userId), context.prisma),
        searchTracks: (_parent, args, context) => Track.search(args, context),
        browseUsers: (_parent, args, context) => User.browse(context, args)
    }
}