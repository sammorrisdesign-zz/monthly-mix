module.exports = {
    init: function(data) {
        Object.keys(data).forEach(function(playlist) {
            data[playlist].featured = data[playlist].tracks.map((track, i) => {
                if (i < 5) {
                    return {
                        artist: track.artist,
                        id: track.id
                    }
                } else {
                    return false;
                }
            });
            data[playlist].featured = data[playlist].featured.filter(Boolean);
        }.bind(this));

        return data;
    }
}
