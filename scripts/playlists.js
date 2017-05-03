var fs = require('fs-extra');
var keys = require('../keys.json');
var youtube = require('youtube-api');
var marked = require('marked');

var playlists = [], currentLength;

module.exports = {
    fetch: function(callback) {
        youtube.authenticate({
            type: 'key',
            key: keys.youtube
        });

        this.getPlaylists(callback);
    },

    getPlaylists: function(callback, pageToken = null) {
        youtube.playlists.list({
            part: 'snippet, id',
            channelId: 'UC-x9dRR5ZSUZE_RIPSYvcuA',
            pageToken: pageToken
        }, function(err, data) {
            for (var i in data.items) {
                playlists[playlists.length] = {
                    id: data.items[i].id,
                    title: data.items[i].snippet.title,
                    description: marked(data.items[i].snippet.description)
                }
            }

            if (data.nextPageToken) {
                this.getPlaylists(callback, data.nextPageToken)
            } else {
                callback(playlists);
            }
        }.bind(this));
    }
} 