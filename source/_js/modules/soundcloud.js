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
    // REMOVE ME LATER
    var sound;
    var currentTrack, defaultTitle, playlistTitle;
    var clientId = "5dcb5ea7cb935713b230330006d1765e";

    return {
        init: function() {
            SC.initialize({
                client_id: clientId
            });

            defaultTitle = document.title;
            playlistTitle = bonzo(qwery(".header__block .post-title")).text();
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
            console.log("skip");
            next = bonzo(qwery('.is-playing')).next().attr('data-track-id');
            console.log(next);
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
            bonzo(qwery('.controls--next .progress-bar')).attr('style', 'width: 0%;');
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
            bonzo(qwery('.controls--active .progress-bar')).attr('style', 'width:' + (position / duration) * 100 + '%;')
        },

        newTrack: function(trackId, scrollTo) {
            context = this;

            trackArtist = bonzo(qwery("#playlist__entry--" + trackId + " .track__artist")).text();
            trackTitle = bonzo(qwery("#playlist__entry--" + trackId + " .track__title")).text();
            goSquared.newTrack(trackArtist, trackTitle, playlistTitle);

            // Set options for player
            var myOptions = {
                useHTML5Audio: true,
                onfinish : function(){
                    this.onSkip();
                }.bind(this),
                whileplaying: function() {
                    this.updateProgressBar(sound.durationEstimate, sound.position);
                }.bind(this),
                ondataerror: function() {
                    console.log("error");
                }
            }
        },

        playTrack: function(trackId, scrollTo) {
            scrollTo = scrollTo || false;
            el = bonzo(qwery('#playlist__entry--' + trackId));
            player = bonzo(qwery("audio"))[0];
            context = this;

            SC.get('/tracks/' + trackId).then(function(track) {
                var url = track.stream_url + "?client_id=" + clientId;
                // Check if it's the current track
                if (url == bonzo(qwery("audio")).attr("src")) {
                    if(player.paused) {
                        player.play();
                        context.onPlay(el);
                    } else {
                        player.pause();
                        context.onStop(el);
                    }
                } else {
                    context.onStop(bonzo(qwery('.is-playing')));
                    bonzo(qwery("audio")).attr("src", url);
                    player.play();
                    context.onPlay(el);
                    player.onended = function() {
                        context.onSkip();
                    }
                }
            });

            if(scrollTo) {
                context.scrollToTrack(el);
            }
        }
    }
});