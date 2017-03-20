var isDeploy = process.argv.slice(2)[0] == 'true' ? true : false;
var assets = require('../scripts/assets.js');
var playlist = require('../scripts/playlist.js');

//assets.html();
playlist.fetch();