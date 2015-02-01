define([
    'libs/bean',
    'libs/bonzo',
    'libs/qwery',
    'utils/loadJSON',
    'sc'
], function(
    bean,
    bonzo,
    qwery,
    loadJSON
) {
    return {
        init: function() {
            loadJSON('/soundcloud-keys.json', function(data) {
                SC.initialize({
                    client_id: data.id
                });
            });

            this.bindEvents();
        },

        bindEvents: function() {
            bean.on(document.body, 'click', '.track', function(e) {
                this.playTrack(e.currentTarget.dataset.trackId);
            }.bind(this));
        },

        playTrack: function(trackId) {
            console.log("Playing" + trackId);
            SC.stream("/tracks/" + trackId, function(sound){
                sound.play();
            });
        }
    }
});