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
    var currentTrack, defaultTitle, playlistTitle;
    var firstPlay = true;
    var clientId = "5dcb5ea7cb935713b230330006d1765e";
    var url = document.location.href.split("#")[0];

    return {
        init: function() {
            SC.initialize({
                client_id: clientId
            });

            defaultTitle = document.title;
            playlistTitle = bonzo(qwery(".header__block .post-title")).text();
            this.bindEvents();
            this.ifHasId();
        },

        bindEvents: function() {
            bean.on(document.body, 'click', '.playlist__entry', function(e) {
                this.ifFirstPlay();
                this.playTrack(e.currentTarget.dataset.trackId);
            }.bind(this));
            bean.on(document.body, 'click', '.audio-controls', function(e) {
                this.controlsPlay();
            }.bind(this));
            bean.on(document.body, 'click', '.controls__buttons__skip', function(e) {
                this.onSkip();
            }.bind(this));
            bean.on(document.body, 'keydown', function(e) {
                this.togglePlayOnSpaceBar(e);
            }.bind(this));
        },

        ifFirstPlay: function() {
            // A workaround to enable native player on iOS
            if (firstPlay) {
                bonzo(qwery("audio"))[0].play();
                firstPlay = false;
            }
        },

        ifHasId: function() {
            var id = document.location.href.split("#")[1];
            if (id.length > 0) {
                bonzo(qwery("#" + id)).addClass('is-playing');
                bonzo(qwery('body')).attr('data-state', 'is-playing');
                this.updateNowPlaying();
                bonzo(qwery("#" + id)).removeClass("is-playing");
                bonzo(qwery('body')).attr('data-state', 'is-stopped');
            }
        },

        controlsPlay: function() {
            id = bonzo(qwery('.post')).attr('data-current-track');

            this.ifFirstPlay();

            if (id) {
                this.playTrack(id);
            } else {
                this.playTrack(bonzo(qwery('.playlist__entry')).attr('data-track-id'))
            }
        },

        scrollToTrack: function(target) {
            scroller.scrollToElement(el, 1000, 'easeInQuad');
        },

        togglePlayOnSpaceBar: function(e) {
            if (e.keyCode == 32) {
                e.preventDefault();
                this.controlsPlay();
            }
        },

        onPlay: function(target) {
            bonzo(qwery("audio"))[0].play();
            target.addClass('is-playing');
            bonzo(qwery('body')).attr('data-state', 'is-playing');
            this.updateNowPlaying();
            this.updateMixColor();
            this.setPageTitle();
            this.updateUrl();
        },

        onSkip: function() {
            next = bonzo(qwery('.is-playing')).next().attr('data-track-id');
            if (next) {
                this.playTrack(next, true);
            } else {
                first = bonzo(qwery('.playlist__entry')[0]).attr('data-track-id');
                this.playTrack(first);
            }
        },

        onStop: function(target) {
            bonzo(qwery("audio"))[0].pause();
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

        updateMixColor: function() {
            bonzo(qwery('.logo__mix')).attr('style', track['color'].replace('background-', ''));
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

        updateUrl: function() {
            history.pushState('', document.title, url + "#track--" + bonzo(qwery('.post')).attr('data-current-track'));
        },

        sendTrackAnalytics: function() {
            trackArtist = bonzo(qwery("#track--" + trackId + " .track__artist")).text();
            trackTitle = bonzo(qwery("#track--" + trackId + " .track__title")).text();
            goSquared.newTrack(trackArtist, trackTitle, playlistTitle);
        },

        playTrack: function(trackId, scrollTo) {
            scrollTo = scrollTo || false;
            el = bonzo(qwery('#track--' + trackId));
            player = bonzo(qwery("audio"))[0];
            context = this;

            SC.get('/tracks/' + trackId).then(function(track) {
                var url = track.stream_url + "?client_id=" + clientId;

                // Check if it's the current track
                if (url == bonzo(qwery("audio")).attr("src")) {
                    if(bonzo(qwery("audio"))[0].paused) {
                        context.onPlay(el);
                    } else {
                        context.onStop(el);
                    }
                } else {
                    context.onStop(bonzo(qwery('.is-playing')));
                    bonzo(qwery("audio")).attr("src", url);
                    context.onPlay(el);
                    player.onended = function() {
                        context.onSkip();
                    }
                    player.ontimeupdate = function() {
                        context.updateProgressBar(player.duration, player.currentTime)
                    }
                    context.sendTrackAnalytics();
                }
            });

            if(scrollTo) {
                context.scrollToTrack(el);
            }
        }
    }
});