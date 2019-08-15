const fs = require('fs-extra');
const playlists = require('./data/playlists.js');
const tracks = require('./data/tracks.js');
const oldData = require('../data.json');

let data = playlists.init();

Object.keys(data).forEach(playlist => {
    if (!oldData[playlist] || data[playlist].etag !== oldData[playlist].etag) {
        console.log('Fetching data for ', playlist);
        data[playlist] = tracks.init(data[playlist]);
    }
});

// Todo: Corrections

console.log('Writing data file');

fs.writeFileSync('data.json', JSON.stringify(data));

