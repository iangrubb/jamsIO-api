const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema')

const { makeExecutableSchema } = require("graphql-tools");

const QueryResolvers = require('./resolvers/base/query')
const MutationResolvers = require('./resolvers/base/mutation')
const SubscriptionResolvers = require('./resolvers/base/subscription')

const DateTimeResolver = require('./resolvers/scalars/DateTime')

const TrackResolvers = require('./resolvers/track')
const JamsUpdateResolvers = require('./resolvers/jamsUpdate')
const UserResolvers = require('./resolvers/user')
const PlaylistResolvers = require('./resolvers/playlist')


const resolvers = {
    ...QueryResolvers,
    ...MutationResolvers,
    ...SubscriptionResolvers,
    ...DateTimeResolver,
    ...TrackResolvers,
    ...JamsUpdateResolvers,
    ...UserResolvers,
    ...PlaylistResolvers
}

const schema = makeExecutableSchema({typeDefs, resolvers})


const { PrismaClient } = require('@prisma/client')
const spotifyAPI = require('../data/spotifyAPI')

// spotifyAPI.clientCredentialsGrant().then( data => {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);
//     // Save the access token so that it's used in future calls
//     spotifyAPI.setAccessToken(data.body['access_token']);
// }).catch(console.log)

// spotifyAPI.searchTracks('Love').then(console.log).catch(console.log)


const authenticate = require('./authenticate')

const context = ({ req }) => {

    const currentUserId = authenticate(req)

    // Add access token in Header, attach here if found
    // spotifyApi.setAccessToken('<your_access_token>')
    
    return {
        spotifyAPI,
        prisma: new PrismaClient(),
        currentUserId
    }

}

module.exports = new ApolloServer({ schema, context });