const keys = require('../../config.json');
const oldData = require('../../data.json');
const meta = require('./meta.js');
const image = require('./image.js');
const youtube = require('youtube-api');

let fetched = 0;

module.exports = {
    init: function(data) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        Object.keys(data).forEach(function(playlist) {
            // Etag comparison only looks at changes to id, title and description. Not tracks within.
            // PlaylistItems has an Etag, maybe this is what we need
            if (!oldData[playlist] || data[playlist].etag !== oldData[playlist].etag) {
                console.log('Fetching new data for', playlist);
                image.generateFor(data[playlist]);
                data[playlist].tracks = this.fetchTracksFromPlaylist(data[playlist]);
            } else {
                data[playlist].tracks = oldData[playlist].tracks;
                fetched++;
            }
        }.bind(this));

        require('deasync').loopWhile(function() {
            let isFetching = Object.keys(data).length > fetched;
            return isFetching;
        })

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

            data.items.forEach(function(item, i) {
                let track = meta.getTrackInfo(item.snippet);
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
