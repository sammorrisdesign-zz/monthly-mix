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
            el = bonzo(qwery('#track-' + trackId));
            current = bonzo(qwery('.is-playing'));

            if (sound) {
                // Check if it's the same track
                if (sound.url.split('/')[4] == trackId) {
                    if (el.hasClass('is-playing')) {
                        sound.pause();
                        el.removeClass('is-playing');
                    } else {
                        sound.play();
                        el.addClass('is-playing');
                    }
                // If not, destory old track and start again
                } else {
                    sound.stop();
                    current.removeClass('is-playing');
                    sound = undefined;
                    this.playTrack(trackId);
                }
            // First time playing of new track
            } else {
                SC.stream('/tracks/' + trackId, function(obj){
                    obj.play();
                    sound = obj;
                    el.addClass('is-playing');
                });
            }
        }
    }
});