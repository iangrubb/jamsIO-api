module.exports = `

    scalar DateTime

    type Query {
        user(id: ID!): User,
        users: [User!]!,
        searchTracks(searchTerm: String!): [Track!]!
    }

    type Mutation {
        signup(username: String!, password: String!): AuthPayload,
        login(username: String!, password: String!): AuthPayload,
        autoLogin(token: String!): AuthPayload,
        authenticateSpotify(code: String!): SpotifyPayload,
        refreshSpotify(token: String!): SpotifyPayload,

        updateJams(additions: [String!], removals: [String!] ): JamsUpdate,

        followUser(followeeID: ID!): User,
        unfollowUser(followeeId: ID!): ID
    }

    type Subscription {
        test: User
    }

    type AuthPayload {
        user: User,
        token: String,
        authUrl: String
    }

    type SpotifyPayload {
        accessToken: String,
        refreshToken: String,
        expiresAt: DateTime
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