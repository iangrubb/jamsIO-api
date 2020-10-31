
// Creates a test ecosystem of users

// Initialize data sources

const { PrismaClient } = require('@prisma/client')
const configureMongo = require('./app/data/mongo')
const makeSpotifyApi = require('./app/data/spotifyApi')

const prisma = new PrismaClient()
const mongo = configureMongo()
const spotifyApi = makeSpotifyApi()

const User = require('./app/models/user')

const faker = require('faker');

const numsTill = number => [ ...Array(number).keys() ]

const seedData = async () => {

    console.log("Deleting old information")

    await Promise.all([
        prisma.trackAddition.deleteMany(),
        prisma.trackRemoval.deleteMany()
    ])

    await Promise.all([
        prisma.jamsUpdate.deleteMany(),
        prisma.follow.deleteMany()
    ])

    await Promise.all([
        prisma.user.deleteMany(),
        mongo.User.deleteMany()
    ])

    console.log("Fetching spotify data")



    const users = await Promise.all(numsTill(20).map(() => (
        User.signup(
            {prisma, spotifyApi, mongo},
            {username: faker.name.findName(), password: faker.internet.password()}
        )
    ))).then(resp => resp.map(r => r.user))

    
    

    // Get pool of tracks from spotify

    // Users





    // Follows

    // Jams history + current jams




    console.log("Finished")

    process.exit()

}




seedData()