
module.exports = class Track {

    // Use the spotify ID as the id. Figure out what to do about the postgres database idea later on. (Maybe it's not needed, and you can just store the spotify id as a foreign key and abandon the track table)

    static convertSpotifyArtist = resp => {
        return {
            id: resp.id,
            name: resp.name
        }
    }

    static convertSpotifyAlbum = resp => {
        return {
            id: resp.id,
            name: resp.name,
            smallImageUrl: resp.images.find(i => i.height === 64).url,
            mediumImageUrl: resp.images.find(i => i.height === 300).url,
            largeImageUrl: resp.images.find(i => i.height === 640).url
        }
    }

    static convertSpotifyTrack = resp => {
        return {
            id: resp.id,
            duration: resp.duration_ms,
            name: resp.name,
            album: this.convertSpotifyAlbum(resp.album),
            artists: resp.artists.map(this.convertSpotifyArtist)
        }
    }

    static search = async ({ searchTerm }, { spotifyApi })  => {

        return spotifyApi.searchTracks(searchTerm)
        .then(data => {

            // Add offset usage for pagination
            const trackData = data.body.tracks.items
            return trackData.map(this.convertSpotifyTrack)
        }, error => console.log(error))



        // Hit spotify endpoint and return tracks 

    }


    // Write a method to fetch tracks with info. Figure out which info should be stored in db and which should be fetched each time from spotify.


}