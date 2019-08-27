module.exports = {
    init: function(data) {
        Object.keys(data).forEach(function(playlist) {
            data[playlist].featured = data[playlist].tracks.map((track, i) => {
                if (i < 6) {
                    return track.artist
                } else {
                    return false;
                }
            });
            data[playlist].featured = data[playlist].featured.filter(Boolean);
            console.log(data[playlist].featured);
        }.bind(this));
        return data;
    }
}
