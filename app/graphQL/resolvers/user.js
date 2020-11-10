const User = require('../../models/user')

module.exports = {
    User: {
        currentJams: (user, _args, context) => User.currentJams(context, user),
        followerCount: (user, _args, context) => User.followerCount(user, context.prisma),
        followeeCount: (user, _args, context) => User.followeeCount(user, context.prisma),
        followsUser: (user, args, context) => User.followsUserWithId(user, parseInt(args.userId), context.prisma),
        followedByUser: (user, args, context) => User.followedByUserWithId(user, parseInt(args.userId), context.prisma)
    }
}