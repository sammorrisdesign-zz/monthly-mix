var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');

module.exports = {
    fetch: function(callback) {
        var playlists = {};

        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        youtube.playlists.list({
            part: 'snippet, id',
            channelId: 'UC-x9dRR5ZSUZE_RIPSYvcuA'
        }, function(err, data) {
            for (var i in data.items) {
                playlists[i] = {
                    id: data.items[i].id,
                    title: data.items[i].snippet.title
                }
            }
            callback(playlists);
        });
    }
} 