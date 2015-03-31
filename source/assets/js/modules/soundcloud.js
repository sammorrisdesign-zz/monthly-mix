define([
    'libs/bean',
    'libs/bonzo',
    'libs/qwery',
    'utils/loadJSON',
    'utils/scroller',
    'sc'
], function(
    bean,
    bonzo,
    qwery,
    loadJSON,
    scroller
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
            bean.on(document.body, 'click', '.playlist__entry', function(e) {
                this.playTrack(e.currentTarget.dataset.trackId);
            }.bind(this));
            bean.on(document.body, 'click', '.audio-controls', function(e) {
                this.controlsPlay();
            }.bind(this));
            bean.on(document.body, 'click', '.controls__buttons__skip', function(e) {
                this.controlsSkip();
            }.bind(this));
        },

        controlsPlay: function() {
            id = bonzo(qwery('.post')).attr('data-current-track');

            if (id) {
                this.playTrack(id);
            } else {
                this.playTrack(bonzo(qwery('.playlist__entry')).attr('data-track-id'))
            }
        },

        controlsSkip: function() {
            this.playTrack(bonzo(qwery('.is-playing')).next().attr('data-track-id'));
        },

        loadingState: function(target, state) {
            if (state === true) {
                target.addClass("is-loading");
            } else {
                target.removeClass("is-loading");
            }
        },

        onPlay: function(target) {
            target.addClass('is-playing');
            scroller.scrollToElement(target, 1000, 'easeInQuad')
            bonzo(qwery('body')).attr('data-state', 'is-playing');
            this.updateNowPlaying();
        },

        onStop: function(target) {
            bonzo(qwery('body')).attr('data-state', 'is-stopped');
            target.removeClass('is-playing');
        },

        getNowPlayingInfo: function() {
            return {
                "id"    : bonzo(qwery('.is-playing')).attr('data-track-id'),
                "color" : bonzo(qwery('.is-playing .playlist__entry__info')).attr('style'),
                "contrast" : bonzo(qwery('.is-playing')).attr('data-track-contrast'),
                "title" : qwery('.is-playing .playlist__entry__title')[0].textContent,
                "artist": qwery('.is-playing .playlist__entry__artist')[0].textContent
            }
        },

        updateNowPlaying: function() {
            track = this.getNowPlayingInfo();

            bonzo(qwery('.post')).attr('data-current-track', track['id']);
            bonzo(qwery('.controls')).removeClass('is-dark is-light is-very-dark').addClass(track['contrast']).attr("style", track['color']);
            bonzo(qwery('.playlist')).attr("style", track['color'].replace(')', ', 0.2)').replace('rgb', 'rgba'));
            bonzo(qwery('.controls .controls__title__track-artist')).text(track['artist']);
            bonzo(qwery('.controls .controls__title__track-title')).text(track['title']);
        },

        playTrack: function(trackId) {
            el = bonzo(qwery('#playlist__entry--' + trackId));
            current = bonzo(qwery('.is-playing'));

            // Set options for player
            var myOptions = {
                onload : function() {
                    // Debug onfinish with this
                    // sound.setPosition(this.duration - 3000);
                },
                onfinish : function(){
                    next = bonzo(qwery('.is-playing')).next().attr('data-track-id');
                    this.playTrack(next);
                }.bind(this),
                onbufferchange: function() {
                    this.loadingState(el, sound.playState);
                }.bind(this),
                onplay: function() {
                    this.loadingState(el, true);
                }.bind(this)
            }

            if (sound) {
                // Check if it's the same track
                if (sound.url.split('/')[4] == trackId) {
                    if (el.hasClass('is-playing')) {
                        sound.pause();
                        this.onStop(el);
                    } else {
                        sound.play();
                        this.onPlay(el);
                    }
                // If not, destroy old track and start again
                } else {
                    sound.stop();
                    this.onStop(current);
                    sound = undefined;
                    this.playTrack(trackId);
                }
            // First time playing of new track
            } else {
                context = this;
                SC.whenStreamingReady(function() {
                    var obj = SC.stream('/tracks/' + trackId, myOptions, function(obj){
                        obj.play();
                        sound = obj;
                        context.onPlay(el);
                    });
                    sound.load();
                });
            }
        }
    }
});