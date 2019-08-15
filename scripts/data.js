const fs = require('fs-extra');
const playlists = require('./data/playlists.js');
const tracks = require('./data/tracks.js');
const corrections = require('./data/corrections.js');

let data = playlists.init();
    data = tracks.init(data);
    data = corrections.init(data);
// Todo: Corrections

console.log('Writing data file');

fs.writeFileSync('data.json', JSON.stringify(data));

