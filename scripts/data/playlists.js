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

        playlists.sort((a,b) => {
            return new Date(b.title) - new Date(a.title);
        })

        var playlistsObject = new Object();

        playlists.forEach(playlist => {
            playlistsObject[playlist.title] = playlist;
        });

        return playlistsObject;
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
                playlists.push({
                    id: playlist.id,
                    title: playlist.snippet.title,
                    month: playlist.snippet.title.split(' ')[0],
                    year: playlist.snippet.title.split(' ')[1],
                    description: playlist.snippet.description,
                    thumbnail: playlist.snippet.thumbnails.medium.url,
                    cover: playlist.snippet.thumbnails.maxres ? playlist.snippet.thumbnails.maxres.url : playlist.snippet.thumbnails.standard.url,
                    etag: playlist.etag
                });
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
