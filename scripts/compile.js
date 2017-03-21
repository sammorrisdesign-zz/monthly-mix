// var isDeploy = process.argv.slice(2)[0] == 'true' ? true : false;
var assets = require('../scripts/assets.js');
var playlists = require('../scripts/playlists.js');
var tracks = require('../scripts/tracks.js');

assets.js();
assets.css();

playlists.fetch(function(data) {
    for (var i in data) {
        tracks.fetch(data[i]);
    }
});