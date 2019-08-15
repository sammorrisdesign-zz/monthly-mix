var corrections = require('./corrections.json');

module.exports = {
    init: function(data) {
        Object.keys(data).forEach(function(playlist) {
            data.playlist = this.correctPlaylist(data[playlist]);
        }.bind(this));
        console.log(corrections);
        return data;
    },

    correctPlaylist: function(playlist) {
        playlist.tracks.forEach(track => {
            const correction = corrections[track.id];
            delete corrections[track.id];
            if (correction) {
                if (correction.artist) {
                    // console.log(track.id, correction.artist, track.artist);
                }

                if (correction.title) {
                    if (correction.title == track.title) {
                        console.log(track.id, correction.title, track.title);
                    }
                }
            }
        });

        return playlist;
    }
}
