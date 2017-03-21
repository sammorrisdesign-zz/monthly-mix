var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');
var assets = require('../scripts/assets.js');

var debug = true;

module.exports = {
    fetch: function(playlist) {
        this.getTracks(playlist.id, function(data) {
            var playlistTracks = this.cleanData(playlist, data);
            var jsonFileLocation = '.data/' + playlistTracks.handle + '.json';
            var oldData = JSON.parse(fs.readFileSync(jsonFileLocation, 'utf8'));

            if (JSON.stringify(oldData.tracks) !== JSON.stringify(playlistTracks.tracks) || debug) {
                fs.mkdirsSync('.data');
                fs.writeFileSync(jsonFileLocation, JSON.stringify(playlistTracks));
                assets.html(playlistTracks);
            }
        }.bind(this));
    },

    getTracksInfo: function(playlistId, callStackSize, pageToken, currentItems, callBack) {
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

    getTracks: function(id, done) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        this.getTracksInfo(id, 0, null, [], done)
    },

    cleanData: function(playlistInfo, data) {
        var playlist = {};
        for (var i in data) {
            playlist[i] = {
                id: data[i].resourceId.videoId,
                artist: this.getArtist(data[i].title),
                title: this.getTitle(data[i].title)
            }
        }

        return {
            lastModified: Date.now(),
            title: playlistInfo.title,
            handle: playlistInfo.title.replace(' ', '-').toLowerCase(),
            id: playlistInfo.id,
            tracks: playlist
        };
    },

    getArtist: function(title) {
        return title.split(' - ')[0];
    },

    getTitle: function(title) {
        return title.split(' - ')[1];
    }
} 