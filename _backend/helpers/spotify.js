// Required Modules
var fs = require("fs");
var spotifyWebApi = require('spotify-web-api-node');
var keys = require('../../spotify-keys.json');

// Global Variables
var spotify = new spotifyWebApi(keys);
module.exports = {
    init: function() {
        this.getPlaylists();
    },

    authenticate: function(functionName) {
        var context = this;
        spotify.clientCredentialsGrant()
        .then(function(data) {
            spotify.setAccessToken(data['access_token']);
            console.log(data['access_token']);
            context[functionName]();
        });
    },

    getPlaylists: function() {
        var context = this;
        spotify.getPlaylist('nidzumi', '4z2ECApbbdGi3YTdPhRsNI')
        .then(function(data) {
            console.log("getting playlists");
            console.log(data.tracks.items);
        }, function(err) {
            console.log(err);
            context.authenticate("getPlaylists");
        });
    }
}
