
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = class User {

    static findAll = async ({ prisma }) => {
        return await prisma.user.findMany()
    }

    static genrateToken = (user) => {
        return jwt.sign(
            { userId: user.id },
            process.env.USER_LOGIN_SECRET
        )
    }

    static autoLogin = async ({ prisma, currentUserId }) =>  {
        const user = await prisma.user.findOne({where: {id: currentUserId}})
        return user
    }

    static login = async ({ prisma }, { username, password }) => {

        const user = await prisma.user.findOne({ where: { username } })

        if (!user) {
            throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        const token = User.genrateToken(user)

        return {user, token}

    }

    static signup = async ({ prisma }, { username, password }) => {

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({data: {
            username,
            password: encryptedPassword
        }})

        const token = User.genrateToken(user)

        return {user, token}
    }

}
