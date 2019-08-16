const keys = require('../../config.json');
const youtube = require('youtube-api');

let pageToken = null;
let playlists = new Object();
let isFetching = true;

module.exports = {
    init: function() {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        this.fetchPlaylists();

        require('deasync').loopWhile(function() { return isFetching; });

        return playlists;
    },

    fetchPlaylists: function() {
        youtube.playlists.list({
            part: 'snippet, id',
            channelId: 'UC-x9dRR5ZSUZE_RIPSYvcuA',
            maxResults: 50,
            pageToken: pageToken
        }, function(err, data) {
            if (err) {
                throw err;
            }

            data.items.forEach(function(playlist) {
                playlists[playlist.snippet.title] = {
                    id: playlist.id,
                    title: playlist.snippet.title,
                    month: playlist.snippet.title.split(' ')[0],
                    year: playlist.snippet.title.split(' ')[1],
                    description: playlist.snippet.description,
                    etag: playlist.etag
                }
            }.bind(this));

            if (data.nextPageToken) {
                pageToken = data.nextPageToken;
                this.fetchPlaylists();
            } else {
                isFetching = false;
            }
        }.bind(this))
    }
}
