module.exports = `

    type Query {
        
    }

    type Mutation {
        
    }

    type Subscription {

    }

    type User {
        id: ID!,
        username: String!,
        email: String!,
        subscribers(limit: Int, after: ID): [User!]!,
        subscriberCount: Int!,
        subscribees(limit: Int, after: ID): [User!]!,
        subscribeeCount: Int!,
        currentPlaylist: [Track!]!,
        trackHistory(limit: Int, after: ID): [Track!]!
    }


    type Track {
        id: ID!,
        spotifyId: String!
    }

    type PlaylistUpdate {
        id: ID!,
        tracks_added: [Track!]!,
        tracks_removed: [Track!]!
    }



`