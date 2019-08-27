var corrections = require('./corrections.json');

module.exports = {
    init: function(data) {
        Object.keys(data).forEach(function(playlist) {
            data[playlist] = this.correctPlaylist(data[playlist]);
        }.bind(this));

        return data;
    },

    correctPlaylist: function(playlist) {
        playlist.tracks.forEach(track => {
            const correction = corrections[track.id];
            if (correction) {
                if (correction.artist) {
                    track.artist = correction.artist;
                }

                if (correction.title) {
                    track.title = correction.title
                }
            }
        });

        return playlist;
    }
}
