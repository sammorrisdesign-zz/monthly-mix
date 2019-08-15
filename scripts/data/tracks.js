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

        data.forEach(function(playlist) {
            playlist = this.fetchTracksFromPlaylist(playlist);
        }.bind(this));

        require('deasync').loopWhile(function() { return data.length > fetched; });

        return data;
    },

    fetchTracksFromPlaylist: function(playlist) {
        youtube.playlistItems.list({
            part: 'snippet',
            maxResults: 50,
            playlistId: playlist.id
        }, function(err, data) {
            if (err) {
                throw err;
            }

            let tracks = [];

            data.items.forEach(function(item) {
                let track = meta.getTrackInfo(item);
                    track.id = item.snippet.resourceId.videoId;

                tracks.push(track);
            });

            fetched++;
            return tracks;
        });
    }
}
