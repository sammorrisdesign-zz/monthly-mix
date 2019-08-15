const fs = require('fs-extra');
const playlists = require('./data/playlists.js');
const tracks = require('./data/tracks.js');

let data = playlists.init();
    // if Etag is diff then get the data
    // data = tracks.init(data);

    console.log('Done');
    console.log(data);
// Todo: Save the data somewhere

