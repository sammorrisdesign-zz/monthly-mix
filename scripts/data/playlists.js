const keys = require('../../config.json');
const youtube = require('youtube-api');

let pageToken = null;
let playlists = new Array();
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
            pageToken: pageToken
        }, function(err, data) {
            if (err) {
                throw err;
            }

            data.items.forEach(function(playlist) {
                playlists.push({
                    id: playlist.id,
                    title: playlist.snippet.title,
                    description: playlist.snippet.description
                })
            }.bind(this));

            if (data.nextPageToken) {
                pageToken = data.nextPageToken;
                this.fetchPlaylists();
            } else {
                isFetching = false;
                console.log('Fetched all Playlists');
            }
        }.bind(this))
    }
}
