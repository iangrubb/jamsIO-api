
const User = require('../../../models/user')
const Track = require('../../../models/track')

module.exports = {
    Query: {
        searchTracks: (_parent, args, context) => Track.search(args, context)
    }
}