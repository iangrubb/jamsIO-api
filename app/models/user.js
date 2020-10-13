

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const makeAuthUrl = spotifyAPI => {
    const scopes = ['user-read-private', 'user-read-email']

    const state = 'secure-this-state'

    const showDialog = true

    return spotifyAPI.createAuthorizeURL(scopes, state, showDialog);
}

module.exports = class User {

    static findAll = async ({ prisma }) => {
        return await prisma.user.findMany()
    }

    static generateToken = (user) => {
        return jwt.sign(
            { userId: user.id },
            process.env.USER_LOGIN_SECRET
        )
    }

    static authenticateSpotify = async ({ spotifyAPI }, { code }) => {

        return spotifyAPI.authorizationCodeGrant(code).then(
            data => {
                return {
                    accessToken: data.body['access_token'], refreshToken: data.body['refresh_token'],
                    expiresIn: data.body['expires_in']
                }
            },
            error => {
                console.log("Spotify Access Error", error)
            }
        )        
    }

    static autoLogin = async ({ prisma, spotifyAPI, currentUserId }) =>  {
        const user = await prisma.user.findOne({where: {id: currentUserId}})

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyAPI)

        return { user, token, authUrl }
    }

    static login = async ({ prisma, spotifyAPI }, { username, password }) => {

        const user = await prisma.user.findOne({ where: { username } })

        if (!user) {
            throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyAPI)

        return { user, token, authUrl }

    }

    static signup = async ({ prisma, spotifyAPI }, { username, password }) => {

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({data: {
            username,
            password: encryptedPassword
        }})

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyAPI)

        return { user, token, authUrl }
    }

}
