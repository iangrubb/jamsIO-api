module.exports = `

    scalar Date

    type Query {
        currentUser: User,
        searchTracks(searchTerm: String!): [Track!]!
    }

    type Mutation {
        signup(username: String!, password: String!): AuthPayload,
        login(username: String!, password: String!): AuthPayload,
        autoLogin: User,
        authenticateSpotify(code: String!): SpotifyPayload,
        refreshSpotify(token: String!): SpotifyPayload,

        updateJams(additions: [String!], removals: [String!]): JamsUpdate,

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
        expiresAt: Date
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

    type Playlist {
        id: ID!,
        user: User!
    }

    type JamsUpdate {
        id: ID!,
        additions: [Track!]!,
        removals: [Track!]!
    }

    type Track {
        id: ID!,
        duration: Int,
        name: String,
        album: Album,
        artists: [Artist]
    }

    type Artist {
        id: ID!,
        name: String
    }

    type Album {
        id: ID!,
        name: String,
        smallImageUrl: String,
        mediumImageUrl: String,
        largeImageUrl: String
    }

`