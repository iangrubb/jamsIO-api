module.exports = class Follow {

    static add = async ({ followeeId }, { prisma, currentUserId }) => {

        // Check that follow doesn't exist yet, add one if it doesn't.
        
        // Check that the ids are different

        const followee = await prisma.user.findOne({where: {id: followeeId}})

        await prisma.user.update({
            where: {id: currentUserId},
            data: {
                following: {
                    connect: [{id: followeeId}]
                }
            }
        })

        return followee

    }

    static remove = async ({ followeeId }, { prisma, currentUserId }) => {

        // Remove the follow if it exists.

        // Return userId of unfollowed

    }
}