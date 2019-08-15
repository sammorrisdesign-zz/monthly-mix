const keys = require('../../config.json');
const meta = require('./meta.js');
const youtube = require('youtube-api');

module.exports = {
    init: function(playlist) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        playlist.tracks = this.fetchTracksFromPlaylist(playlist);

        return playlist;
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
                let track = meta.getTrackInfo(item.snippet);
                    track.id = item.snippet.resourceId.videoId;

                tracks.push(track);
            });
            isFetching = false;
        });

        require('deasync').loopWhile(function() { return isFetching });

        return tracks;
    }
}
