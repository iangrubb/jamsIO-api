module.exports = class Jams {

    static update = async ({ additions, removals }, { prisma, currentUserId }) => {

        //  Validate: check that additions aren't on list, removals are on list, and there won't be more than 10 jams.

        // Create new update with many removals and many additions. (Should be prisma support for this.)

        // return the jams update

    }
}