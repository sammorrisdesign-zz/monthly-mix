const fs = require('fs-extra');
const playlists = require('./data/playlists.js');
const tracks = require('./data/tracks.js');

let data = playlists.init();
    data = tracks.init(data);

