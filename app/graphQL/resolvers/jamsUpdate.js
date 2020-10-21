
const Track = require('../../models/track')

module.exports = {
    JamsUpdate: {
        additions: (jamsUpdate, _args, context) => {
            const ids = jamsUpdate.trackAdditions.map(a => a.trackId)
            return ids.length > 0 ? Track.getFullData(context, ids) : []
        },
        removals: (jamsUpdate, _args, context) => {
            const ids = jamsUpdate.trackRemovals.map(r => r.trackId)
            return ids.length > 0 ? Track.getFullData(context, ids) : []
        }
    }
}