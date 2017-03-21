var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');

module.exports = {
    fetch: function() {
        var id = 'PLYR_FLaQpljOY9YTl4UArYVXn12P8BGBB';
        var data = {};

        this.getPlaylist(id, function(playlist) {
            fs.mkdirsSync('.data');
            fs.writeFileSync('.data/february.json', JSON.stringify(playlist));
        });
    },

    getPlaylistInfo: function(playlistId, callStackSize, pageToken, currentItems, callBack) {
        youtube.playlistItems.list({
            part: 'snippet',
            pageToken: pageToken,
            maxResults: 50,
            playlistId: playlistId
        }, function(err, data) {
            if (err) {
                callback({error: err});
                return
            };

            for (var x in data.items) {
                currentItems.push(data.items[x].snippet);
            }

            if (data.nextPageToken) {
                this.getPlaylistInfo(playlistId, callStackSize + 1, data.nextPageToken, currentItems, callBack)
            } else {
                callBack(currentItems);
            }
        });
    },

    getPlaylist: function(id, done) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        this.getPlaylistInfo(id, 0, null, [], done)
    }
} 