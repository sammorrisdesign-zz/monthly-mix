// Required Modules
var request = require('request');
var handlebars = require("handlebars");
var fs = require("fs");

// Local Modules
var templates = require("./helpers/templates.js");
var spotify = require("./helpers/spotify.js");

// External Files
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

templates.build('index', {
    test: "hello again"
});

spotify.init();

/*
spotify.clientCredentialsGrant()
    .then(function(data) {
        spotify.setAccessToken(data['access_token']);
        console.log(data['access_token']);
        
        spotify.getPlaylist('nidzumi', '4z2ECApbbdGi3YTdPhRsNI')
    .then(function(data) {
        console.log(data.tracks.items);
    });
        
    })
spotify.getUser('nidzumi').then(function(data) { console.log(data); });

spotify.getUserPlaylists('nidzumi').then(function(data) { console.log(data); }, function(err) { console.log(err); });

spotify.getPlaylist('nidzumi', '4z2ECApbbdGi3YTdPhRsNI')
    .then(function(data) {
        console.log(data);
    });
*/
