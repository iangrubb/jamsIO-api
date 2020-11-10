const { compareSync } = require("bcryptjs")

module.exports = class Follow {

    static add = async ({ prisma, currentUserId }, { followeeId }) => {

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

    static remove = async ({ prisma, currentUserId }, { followeeId }) => {

        // Remove the follow if it exists.

        const followee = await prisma.user.findOne({where: {id: followeeId}})

        await prisma.user.update({
            where: {id: currentUserId},
            data: {
                following: {
                    disconnect: [{id: followeeId}]
                }
            }
        })

        return followee
    }

}