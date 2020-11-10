
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Track = require('./track');

const makeAuthUrl = spotifyApi => {
    const scopes = ['user-read-private']

    const state = 'secure-this-state'

    const showDialog = true

    return spotifyApi.createAuthorizeURL(scopes, state, showDialog);
}

module.exports = class User {

    static browse = async ({prisma}, { searchTerm }) => {

        if (searchTerm) {
            return prisma.user.findMany({
                where: {
                    username: {
                        contains: searchTerm,
                        mode: "insensitive",
                    }},
                take: 15
            })
        } else {
            return prisma.user.findMany({
                take: 15
            })
        }
    }

    static current = async ({ currentUserId, prisma }) => {
        return await prisma.user.findOne({where: {id: currentUserId}})
    }

    static generateToken = (user) => {
        return jwt.sign(
            { userId: user.id },
            process.env.USER_LOGIN_SECRET || "Test"
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

    static signup = async ({ prisma, spotifyApi, mongo }, { username, password }) => {

        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({data: {
            username,
            password: encryptedPassword
        }})

        const mongoUser = new mongo.User({_id: user.id, currentJamIds: [], notifications: [], listenedTrackIds: []})
        
        await mongoUser.save()
        

        const token = User.generateToken(user)

        const authUrl = makeAuthUrl(spotifyApi)

        return { user, token, authUrl }
    }

    static currentJams = async ({ mongo, spotifyApi }, user) => {

        const mongoUser = await mongo.User.findById(user.id)

        const trackIds = mongoUser.currentJamIds

        if (trackIds.length === 0) {
            return []
        } else {
            return Track.getFullData({ spotifyApi }, trackIds)
        }
    }

    static followerCount = async (user, prisma) => {
        
        const count = await prisma.user.findOne({
            where: {id: user.id}
        }).followedBy()

        return count.length

    }

    static followeeCount = async (user, prisma) => {

        const count = await prisma.user.findOne({
            where: {id: user.id}
        }).following()

        return count.length

    }

    static followsUserWithId = async (user, otherUserId, prisma) => {

        const response =
            await prisma.user
            .findOne({where: {id: otherUserId}})
            .followedBy({where: {id: user.id}})
        
        return response.length > 0
        
    }

    static followedByUserWithId = async (user, otherUserId, prisma) => {
            
        const response =
            await prisma.user
            .findOne({where: {id: user.id}})
            .followedBy({where: {id: otherUserId}})
        
        return response.length > 0
        
    }

}
