module.exports = `

    type Query {
        test: User
    }

    type Mutation {
        signup(username: String!, password: String!): AuthPayload,
        login(username: String!, password: String!): AuthPayload
    }

    type Subscription {
        test: User
    }

    type User {
        id: ID!,
        username: String!,
        followers(limit: Int, after: ID): [User!]!,
        followerCount: Int!,
        followees(limit: Int, after: ID): [User!]!,
        followeeCount: Int!,
        currentPlaylist: [Track!]!,
        trackHistory(limit: Int, after: ID): [Track!]!
    }

    type AuthPayload {
        user: User,
        token: String
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