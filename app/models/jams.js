
module.exports = class Jams {

    static update = async ({ prisma, mongo, currentUserId }, { additions, removals }) => {

        const currentUser = await mongo.User.findById(currentUserId)

        const newJamIds = 
            currentUser.currentJamIds
            .filter(id => !removals.find(r => r === id))
            .concat(additions)

        const jamsUpdate = await prisma.jamsUpdate.create({
            data: {
                user: {
                    connect: { id: currentUserId },
                },
                trackAdditions: {
                    create: additions.map(id => ({trackId: id}))
                },
                trackRemovals: {
                    create: removals.map(id => ({trackId: id}))
                }
            },
            include: {trackAdditions: true, trackRemovals: true}
        })

        await mongo.User.updateOne(
            {_id: currentUserId},
            {currentJamIds: newJamIds}
        )

        return jamsUpdate
    }
}