
// Creates a test ecosystem of users

// Data sources

const { PrismaClient } = require('@prisma/client')
const configureMongo = require('./app/data/mongo')
const makeSpotifyApi = require('./app/data/spotifyApi')

const prisma = new PrismaClient()
const mongo = configureMongo()

const spotifyApi = makeSpotifyApi()
const token = "BQAOkXMOY84tkvdsn1IpU6pPGACoxljXZmD4DVqfb773wqj4qx0tcB3KM43Da3VVFaOj2jdQjAXG6HGSJbQbo6JUQOBx_5M9ISvgx4i0AEP36z0eNrVVD2NeLVFbJSoE6YqXWiJOsit_rnu9ZLCXWMAi9UnA3iNcXTI"
spotifyApi.setAccessToken(token)

// Models

const User = require('./app/models/user')
const Follow = require('./app/models/follow')
const Jams = require('./app/models/jams')
const Track = require('./app/models/track')

// Randomization

const faker = require('faker');
const { update } = require('./app/models/jams')
const { connect } = require('mongoose')
const { add } = require('./app/data/mongo/schemas/user')

const numsTill = number => [ ...Array(number).keys() ]

const randomSubset = (array, odds) => (
    array.filter(()=> Math.random() <= odds)
)

const randomSubsetCount = (array, count) => {
    if (count >= array.length) return array

    return array.reduce((acc, value, idx) => {

        const needed = count - acc.length
        const remaining = array.length - idx

        if (needed === remaining) {
            acc.push(value)
        }

        if (needed > 0) {

            const odds = needed / remaining
            
            if (Math.random() > odds) {
                acc.push(value)
            }
        } 

        return acc

        // count - acc.length is number needed

        // array.length - idx is number remaining

        

    }, [])
}

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
                { prisma, currentUserId: followingUser.id},
                { followeeId: followedUser.id }
            )
        ))
    )))

    console.log("Fetching Spotify Tracks")

    const trackIds = await Promise.all(numsTill(3).map(() => (
        spotifyApi.searchTracks(faker.commerce.department())
    ))).then(responses => responses.map(resp => resp.body.tracks.items).flat().map(x => x.id))
    
    for (let user of users) {

        let updateCount = 0
        let currentJamIds = []

        while (updateCount < 10) {
            const frequency = Math.ceil(Math.random() * 4)

            const removals = currentJamIds.filter((id, idx)=>idx % frequency === 0)

            const filteredJamIds = currentJamIds.filter(id => removals.find(x => x === id))

            const choosableTrackIds = trackIds.filter(id => !filteredJamIds.find(x => x === id))

            const addCount = filteredJamIds.length > 3 ? 10 - filteredJamIds.length - Math.floor(Math.random() * 4) : 3

            const additions = randomSubsetCount(choosableTrackIds, addCount)

            await Jams.update({ prisma, mongo, currentUserId: user.id }, { additions, removals })

            currentJamIds = [...additions, ...filteredJamIds]

            updateCount++
        }

    }

    console.log("Finished")

    process.exit()

}




seedData()