module.exports = class Follow {

    static add = async ({ followeeId }, { prisma, currentUserId }) => {

        // Check that follow doesn't exist yet, add one if it doesn't.

        // Return user followed

    }

    static remove = async ({ followeeId }, { prisma, currentUserId }) => {

        // Remove the follow if it exists.

        // Return userId of unfollowed

    }
}