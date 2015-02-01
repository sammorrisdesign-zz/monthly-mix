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
    var sound;

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
            el = qwery('#track-' + trackId);

            if (sound) {
                if (bonzo(el).hasClass('is-playing')) {
                    sound.pause();
                    bonzo(el).removeClass('is-playing');
                } else {
                    sound.play();
                    bonzo(el).addClass('is-playing');
                }
            } else {
                SC.stream('/tracks/' + trackId, function(obj){
                    obj.play();
                    sound = obj;
                    bonzo(el).addClass('is-playing');
                });
            }
        }
    }
});