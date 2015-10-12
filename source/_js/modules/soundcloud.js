define([
    'libs/bean',
    'libs/bonzo',
    'libs/qwery',
    'utils/loadJSON',
    'utils/scroller',
    'modules/go-squared',
    'sc'
], function(
    bean,
    bonzo,
    qwery,
    loadJSON,
    scroller,
    goSquared
) {
    var sound, defaultTitle, playlistTitle;

    return {
        init: function() {
            loadJSON('/soundcloud-keys.json', function(data) {
                SC.initialize({
                    client_id: data.id
                });
            });

            defaultTitle = document.title;
            playlistTitle = bonzo(qwery(".header__block .post-title")).text();
            this.bindEvents();
            this.initPlayer();
        },

        bindEvents: function() {
            bean.on(document.body, 'click', '.playlist__entry', function(e) {
                this.playTrack(e.currentTarget.dataset.trackId);
            }.bind(this));
            bean.on(document.body, 'click', '.audio-controls', function(e) {
                this.controlsPlay();
            }.bind(this));
            bean.on(document.body, 'click', '.controls__buttons__skip', function(e) {
                this.onSkip();
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

        loadingState: function(target, state) {
            if (state === true) {
                target.addClass("is-loading");
            } else {
                target.removeClass("is-loading");
            }
        },

        scrollToTrack: function(target) {
            scroller.scrollToElement(el, 1000, 'easeInQuad');
        },

        onPlay: function(target) {
            target.addClass('is-playing');
            bonzo(qwery('body')).attr('data-state', 'is-playing');
            this.updateNowPlaying();
            this.setPageTitle();
        },

        onSkip: function() {
            console.log("on skip function");
            next = bonzo(qwery('.is-playing')).next().attr('data-track-id');
            if (next) {
                this.playTrack(next, true);
            } else {
                first = bonzo(qwery('.playlist__entry')[0]).attr('data-track-id');
                this.playTrack(first);
            }
        },

        onStop: function(target) {
            bonzo(qwery('body')).attr('data-state', 'is-stopped');
            target.removeClass('is-playing');
            this.resetPageTitle();
        },

        getNowPlayingInfo: function() {
            return {
                "id"    : bonzo(qwery('.is-playing')).attr('data-track-id'),
                "color" : bonzo(qwery('.is-playing .playlist__entry__info')).attr('style'),
                "contrast" : bonzo(qwery('.is-playing')).attr('data-track-contrast'),
                "title" : qwery('.is-playing .playlist__entry__title')[0].textContent,
                "artist": qwery('.is-playing .playlist__entry__artist')[0].textContent,
                "permalink" : bonzo(qwery('.is-playing')).attr('data-track-permalink')
            }
        },

        updateNowPlaying: function() {
            track = this.getNowPlayingInfo();

            // Don't update if the track isn't new
            if (bonzo(qwery('.post')).attr('data-current-track') == track['id']) {
                return false;
            }

            bonzo(qwery('.controls--next .controls__buttons__soundcloud a')).attr('href', track['permalink']);
            bonzo(qwery('.is-changable')).attr("style", track['color'].replace('background-', ''));
            bonzo(qwery('.post')).attr('data-current-track', track['id']);
            bonzo(qwery('.controls--next')).removeClass('is-dark is-light is-very-dark is-default').addClass(track['contrast']).attr("style", track['color']);
            bonzo(qwery('.controls--next .controls__buttons .input')).attr('style', track['color']);
            bonzo(qwery('.playlist')).attr("style", track['color'].replace(')', ', 0.2)').replace('rgb', 'rgba'));
            bonzo(qwery('.controls--next .controls__title__track-artist')).text(track['artist']);
            bonzo(qwery('.controls--next .controls__title__track-title')).text(track['title']);
            bonzo(qwery('.controls--next .progress-bar__current')).attr('style', 'width: 0%;');
            bonzo(qwery('.controls--active')).removeClass("controls--active").addClass("controls--previous");
            bonzo(qwery('.controls--next')).removeClass("controls--next").addClass("controls--active");
            bonzo(qwery('.controls--previous')).removeClass("controls--previous").addClass("controls--next");
        },

        setPageTitle: function() {
            track = this.getNowPlayingInfo();
            document.title = track.artist + " - \"" + track.title + "\" on " + defaultTitle;
        },

        resetPageTitle: function() {
            document.title = defaultTitle;
        },

        updateProgressBar: function(duration, position) {
            bonzo(qwery('.controls--active .progress-bar__current')).attr('style', 'width:' + (position / duration) * 100 + '%;')
        },

        newTrack: function(trackId, scrollTo) {
            context = this;

            trackArtist = bonzo(qwery("#playlist__entry--" + trackId + " .track__artist")).text();
            trackTitle = bonzo(qwery("#playlist__entry--" + trackId + " .track__title")).text();
            goSquared.newTrack(trackArtist, trackTitle, playlistTitle);

            // Set options for player
            var myOptions = {
                useHTML5Audio: true,
                onload : function() {
                    // readyState 2 means failed or error in fetching track
                    if (this.readyState == 2) {
                        context.onSkip();
                    }
                    // Debug onfinish with this
                    // sound.setPosition(this.duration - 3000);
                },
                onfinish : function(){
                    this.onSkip();
                }.bind(this),
                onbufferchange: function() {
                    this.loadingState(el, sound.playState);
                }.bind(this),
                whileplaying: function() {
                    this.updateProgressBar(sound.durationEstimate, sound.position);
                }.bind(this),
                ondataerror: function() {
                    console.log("error");
                },
                onplay: function() {
                    this.loadingState(el, true);
                }.bind(this)
            }

            SC.whenStreamingReady(function() {
                SC.stream('/tracks/' + trackId, myOptions, function(obj){
                    sound = obj;
                    sound.play();
                    context.onPlay(el);
                    if (scrollTo) {
                        context.scrollToTrack(el);
                    }
                });
            });
        },

        initPlayer: function() {
            // Triggers audio for mobile devices
            SC.whenStreamingReady(function() {
               SC.stream('/tracks/' + bonzo(qwery('.playlist__entry')).attr('data-track-id'), {}, function(obj) {
               }) 
            });
        },

        playTrack: function(trackId, scrollTo) {
            scrollTo = scrollTo || false;
            el = bonzo(qwery('#playlist__entry--' + trackId));
            current = bonzo(qwery('.is-playing'));
            this.loadingState(el, false);

            if (sound) {
                // Check if it's the same track
                if (sound.url.split('/')[4] == trackId) {
                    if (el.hasClass('is-playing')) {
                        sound.pause();
                        this.onStop(el);
                    } else {
                        sound.play();
                        this.onPlay(el);
                        if (scrollTo) {
                            this.scrollToTrack(el);
                        }
                        this.loadingState(el, sound.playState);
                    }
                // If not, destroy old track and start again
                } else {
                    sound.stop();
                    this.onStop(current);
                    sound = undefined;
                    this.newTrack(trackId, scrollTo);
                }
            } else {
                this.newTrack(trackId, scrollTo);
            }
        }
    }
});