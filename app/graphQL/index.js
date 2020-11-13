const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema')

const { makeExecutableSchema } = require("graphql-tools");

const QueryResolvers = require('./resolvers/base/query')
const MutationResolvers = require('./resolvers/base/mutation')

const DateResolver = require('./resolvers/scalars/date')

const TrackResolvers = require('./resolvers/track')
const JamsUpdateResolvers = require('./resolvers/jamsUpdate')
const UserResolvers = require('./resolvers/user')
const PlaylistResolvers = require('./resolvers/playlist')

const resolvers = {
    ...QueryResolvers,
    ...MutationResolvers,
    ...DateResolver,
    ...TrackResolvers,
    ...JamsUpdateResolvers,
    ...UserResolvers,
    ...PlaylistResolvers
}

const schema = makeExecutableSchema({typeDefs, resolvers})


const { PrismaClient } = require('@prisma/client')

const makeSpotifyApi = require('../data/spotifyApi')

const configureMongo = require('../data/mongo')

const authenticate = require('./authenticate')

const prisma = new PrismaClient()

const context = ({ req }) => {

    const currentUserId = authenticate(req)

    const accessToken = req.get('X-access-token')
    
    const spotifyApi = makeSpotifyApi()

    

    if (accessToken) {
        spotifyApi.setAccessToken(accessToken)
    }

    return {
        spotifyApi,
        prisma,
        mongo: configureMongo(),
        currentUserId
    }

}

module.exports = new ApolloServer({ schema, context });