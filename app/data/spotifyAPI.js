const SpotifyWebApi = require('spotify-web-api-node');

const clientBaseUrl = 'http://localhost:3000'

module.exports = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:3000/authentication-response`
});