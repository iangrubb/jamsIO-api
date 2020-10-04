const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema')

const { makeExecutableSchema } = require("graphql-tools");

const QueryResolvers = require('./resolvers/base/query')
const MutationResolvers = require('./resolvers/base/mutation')
const SubscriptionResolvers = require('./resolvers/base/subscription')

const TrackResolvers = require('./resolvers/track')
const PlaylistUpdateResolvers = require('./resolvers/playlistUpdate')
const UserResolvers = require('./resolvers/user')


const resolvers = {
    ...QueryResolvers,
    ...MutationResolvers,
    ...SubscriptionResolvers,
    ...TrackResolvers,
    ...PlaylistUpdateResolvers,
    ...UserResolvers
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
    
    return {
        // spotifyAPI,
        prisma: new PrismaClient(),
        currentUserId
    }

}


module.exports = new ApolloServer({ schema, context });