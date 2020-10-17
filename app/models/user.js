
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const makeAuthUrl = spotifyApi => {
    const scopes = ['user-read-private', 'user-read-email']

    const state = 'secure-this-state'

    const showDialog = true

    return spotifyApi.createAuthorizeURL(scopes, state, showDialog);
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

    static authenticateSpotify = async ({ spotifyApi }, { code }) => {
        return spotifyApi.authorizationCodeGrant(code).then(
            data => {
                return {
                    accessToken: data.body['access_token'], refreshToken: data.body['refresh_token'],
                    expiresAt: new Date(Date.now() + (data.body['expires_in'] * 1000))
                }
            },
            error => {
                console.log("Spotify Access Error", error)
            }
        )        
    }

    static refreshSpotify = async ({ spotifyApi }, { token }) => {

        spotifyApi.setRefreshToken(token)
                
        return spotifyApi.refreshAccessToken().then(
            data => {
                return {
                    accessToken: data.body['access_token'],
                    expiresAt: new Date(Date.now() + (data.body['expires_in'] * 1000))
                }
            },
            error => {
                // Handle error refreshing token
                console.log(error)
            }
        );
    }

    static autoLogin = async ({ prisma, currentUserId }) =>  {
        const user = await prisma.user.findOne({where: {id: currentUserId}})
        return user
    }

    static login = async ({ prisma, spotifyApi }, { username, password }) => {

        const user = await prisma.user.findOne({ where: { username } })

        if (!user) {
            throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyApi)

        return { user, token, authUrl }

    }

    static signup = async ({ prisma, spotifyApi }, { username, password }) => {

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({data: {
            username,
            password: encryptedPassword
        }})

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyApi)

        return { user, token, authUrl }
    }

}
