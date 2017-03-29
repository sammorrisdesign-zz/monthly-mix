// var isDeploy = process.argv.slice(2)[0] == 'true' ? true : false;
var assets = require('../scripts/assets.js');
var playlists = require('../scripts/playlists.js');
var tracks = require('../scripts/tracks.js');
var archive = require('../scripts/archive.js');
var fs = require('fs-extra');

fs.removeSync('.build');

assets.js();
assets.css();
assets.images();

playlists.fetch(function(data) {
    for (var i in data) {
        var isIndex = (i == 0 ? true : false);
        tracks.fetch(data[i], isIndex);
    }

    archive.compile();
    assets.html();
});