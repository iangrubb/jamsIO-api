module.exports = `

    type Query {
        user(id: ID!): User,
        users: [User!]!,
        searchTracks(searchTerm: String!): [Track!]!
    }

    type Mutation {
        signup(username: String!, password: String!): AuthPayload,
        login(username: String!, password: String!): AuthPayload,
        autoLogin(token: String!): User,

        updateJams(additions: [String!], removals: [String!] ): User,

        followUser(followeeID: ID!): User

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
        currentJams: [Track!]!,
        jamsUpdates: [JamsUpdate!]!,
        playHistory(limit: Int, after: ID): [Track!]!
    }

    type AuthPayload {
        user: User,
        token: String
    }

    type Track {
        id: ID,
        spotifyId: String!
    }

    type Playlist {
        id: ID!,
        spotifyId: String!,
        user: User!
    }

    type JamsUpdate {
        id: ID!,
        tracksAdded: [Track!]!,
        tracksRemoved: [Track!]!
    }


`