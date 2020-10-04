const SpotifyWebApi = require('spotify-web-api-node');

module.exports = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
//   redirectUri: 'http://www.example.com/callback'
});