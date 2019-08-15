const keys = require('../../config.json');
const meta = require('./meta.js');
const youtube = require('youtube-api');

let fetched = 0;

module.exports = {
    init: function(data) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        Object.keys(data).forEach(function(playlistName) {
            data[playlistName].tracks = this.fetchTracksFromPlaylist(data[playlistName]);
            console.log('going to fetch');
        }.bind(this));

        require('deasync').loopWhile(function() {
            let isFetching = Object.keys(data).length > fetched;
            return isFetching;
        });

        console.log('fetched tracks');

        return data;
    },

    fetchTracksFromPlaylist: function(playlist) {
        let isFetching = true;
        let tracks = [];

        youtube.playlistItems.list({
            part: 'snippet',
            maxResults: 50,
            playlistId: playlist.id
        }, function(err, data) {
            if (err) {
                throw err;
            }

            data.items.forEach(function(item) {
                let track = meta.getTrackInfo(item);
                    track.id = item.snippet.resourceId.videoId;

                tracks.push(track);
            });
            isFetching = false;
        });

        require('deasync').loopWhile(function() { return isFetching });
        fetched++;
        return tracks;
    }
}
