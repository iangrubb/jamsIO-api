
// Creates a test ecosystem of users

// Data sources

const { PrismaClient } = require('@prisma/client')
const configureMongo = require('./app/data/mongo')
const makeSpotifyApi = require('./app/data/spotifyApi')

const prisma = new PrismaClient()
const mongo = configureMongo()


const spotifyApi = makeSpotifyApi()
const token = ""
spotifyApi.setAccessToken(token)

// Models

const User = require('./app/models/user')
const Follow = require('./app/models/follow')

// Randomization

const faker = require('faker');

const numsTill = number => [ ...Array(number).keys() ]

const randomSubset = (array, odds) => (
    array.filter(()=> Math.random() <= odds)
)

const seedData = async () => {

    console.log("Deleting old information")

    await Promise.all([
        prisma.trackAddition.deleteMany(),
        prisma.trackRemoval.deleteMany()
    ])

    await Promise.all([
        prisma.jamsUpdate.deleteMany()
    ])

    await Promise.all([
        prisma.user.deleteMany(),
        mongo.User.deleteMany()
    ])

    console.log("Creating Users")

    const users = await Promise.all(numsTill(20).map(() => (
        User.signup(
            {prisma, spotifyApi, mongo},
            {username: faker.name.findName(), password: faker.internet.password()}
        )
    ))).then(resp => resp.map(r => r.user))

    console.log("Creating Follows")

    await Promise.all(users.flatMap(followingUser => (
        randomSubset(users, 0.2).map(followedUser => (
            Follow.add(
                { followeeId: followedUser.id },
                { prisma, currentUserId: followingUser.id}
            )
        ))
    )))

    console.log("Fetching Spotify Tracks")

    const tracks = await Promise.all(numsTill(3).map(() => (
        spotifyApi.searchTracks(faker.commerce.department())
    ))).then(responses => responses.map(resp => resp.body.tracks.items).flat())

    



    // Users





    // Follows

    // Jams history + current jams




    console.log("Finished")

    process.exit()

}




seedData()