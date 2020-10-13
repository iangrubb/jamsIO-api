
const User = require('../../../models/user')
const Track = require('../../../models/track')

module.exports = {
    Query: {
        users: (_parent, _args, context) => User.findAll(context),
        searchTracks: (_parent, args, context) => Track.search(args, context)
    }
}