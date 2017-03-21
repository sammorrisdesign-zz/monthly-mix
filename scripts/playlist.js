var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');

module.exports = {
    fetch: function() {
        var id = 'PLYR_FLaQpljOY9YTl4UArYVXn12P8BGBB';

        this.getPlaylist(id, function(data) {
            var playlist = this.cleanData(data);

            fs.mkdirsSync('.data');
            fs.writeFileSync('.data/february.json', JSON.stringify(playlist));
        }.bind(this));
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
    },

    cleanData: function(data) {
        var playlist = {};
        for (var i in data) {
            playlist[i] = {
                id: data[i].resourceId.videoId,
                artist: this.getArtist(data[i].title),
                title: this.getTitle(data[i].title)
            }
        }

        return playlist;
    },

    getArtist: function(title) {
        return title.split(' - ')[0];
    },

    getTitle: function(title) {
        return title.split(' - ')[1];
    }
} 