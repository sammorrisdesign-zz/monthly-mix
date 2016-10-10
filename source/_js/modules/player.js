var Player = (function () {
    // Todo: Split page title and history into a separate module
    // Todo: split page updating bits into a separate module
    // This file should just be about playing tracks and triggering other modules
    var currentTrack,
        defaultTitle,
        playlistTitle,
        clientId = '5dcb5ea7cb935713b230330006d1765e',
        firstPlay = true,
        url = document.location.href.split('#')[0];

    var bindEvents = function() {
        $('.playlist__entry').click(function() {
            ifFirstPlay();
            playTrack($(this).attr('data-track-id'));
        });
        $('.audio-controls').click(function(el) {
            controlsPlay();
        });
        $('body').keyup(function(e){
           if(e.keyCode == 32){
                togglePlayOnSpaceBar(e);
           }
        });
    };

    var ifFirstPlay = function() {
        // A workaround to enable the native player on iOS
        if (firstPlay) {
            $('audio').get(0).play();
            firstPlay = false;
        }
    }

    var ifHasId = function() {
        // This isn't the cleanest way of doing this
        // Should be able to figure out a better way of doing.
        // Ideally without js
        var id = document.location.href.split('#')[1];
        if (id.length > 0) {
            $('#' + id).addClass('is-playing');
            $('body').attr('data-state', 'is-playing');
            updatePage();
            $('#' + id).removeClass('is-playing');
            $('body').attr('data-state', 'is-stopped');
        }
    }

    var controlsPlay = function() {
        id = $('.post').attr('data-current-track');

        ifFirstPlay();
        
        if (id) {
            playTrack(id);
        } else {
            playTrack($('.playlist__entry').attr('data-track-id'))
        }
    }

    var scrollToTrack = function(target) {
        // this looks dodgy
        scroller.scrollToElement(el, 1000, 'easeInQuad');
    }

    var togglePlayOnSpaceBar = function(e) {
        e.preventDefault();
        controlsPlay();
    }

    var onPlay = function(track) {
        $('audio').get(0).play();
        $(track).addClass('is-playing');
        $('body').attr('data-state', 'is-playing');
        updatePage();
        setPageTitle();
        updateUrl();
    }

    var onSkip = function() {
        // the next var should probably be a single line if statement to get next track id (next or first)
        next = $('.is-playing').next().attr('data-track-id');
        if (next) {
            playTrack(next, true);
        } else {
            first = $('playlist__entry').attr('data-track-id');
            playTrack(first);
        }
    }

    var onStop = function(track) {
        $('audio').get(0).pause();
        $('body').attr('data-state', 'is-stopped');
        $(track).removeClass('is-playing');
        resetPageTitle();
    }

    var getNowPlayingInfo = function() {
        return {
            'id':           $('.is-playing').attr('data-track-id'),
            'color':        $('.is-playing .playlist__entry__info').attr('style'),
            'contrast':     $('.is-playing').attr('data-track-contrast'),
            'title':        $('.is-playing .playlist__entry__title').text(),
            'artist':       $('.is-playing .playlist__entry__artist').text(),
            'permalink':    $('is-playing').attr('data-track-permalink')
        }
    };

    var updatePage = function() {
        this.updateNowPlaying();
        this.updatePageColor();
    }

    var updateNowPlaying = function() {
        track = this.getNowPlayingInfo();

        // Don't update if track isn't new
        if ($('.post').attr('data-current-track') == track.id) {
            return false;
        } else {
            $('.is-changable').attr('style', track.color.replace('background-', ''));
            $('.post').attr('data-current-track', track.id);
            $('body').removeClass('is-dark is-light is-very-dark').addClass(track.contrast);
            $('.controls--next .audio-controls').attr('style', track.color);
            $('.controls--next .controls__title__track-artist').text(track.artist);
            $('.controls--next .controls__title__track-title').text(track.title);
            $('.controls--next .progress-bar').attr('style', 'width: 100%;');
            $('.controls--active').removeClass('controls--active').addClass('controls--previous');
            $('.controls--next').removeClass('controls--next').addClass('controls--active');
            $('.controls--previous').removeClass('controls--previous').addClass('controls--next');
        }
    };

    var updatePageColor = function() {
        $('.post-header').attr('style', track.color);
    };

    var setPageTitle = function() {
        track = this.getNowPlayingInfo();
        document.title = track.artist + " - \"" + track.title + "\" on " + defaultTitle;
    };

    var resetPageTitle = function() {
        document.title = defaultTitle;
    };

    var updateProgressBar = function(duration, position) {
        $('.controls--active .progress-bar').attr('style', 'width' + (position / duration) * 100 + '%;');
    };

    var updateUrl = function() {
        history.pushState('', document.title, url + "#track--" + $('.post').attr('data-current-track'));
    };

    var sendTrackAnalytics = function() {
        // TODO: add artist and title as data attributes to #track--xxxxxxx
        trackArtist = $("#track--" + trackId + " .track__artist").text();
        trackTitle = $("#track--" + trackId + " .track__title").text();
        goSquared.newTrack(trackArtist, trackTitle, playlistTitle);
    };

    var playTrack = function(trackId, scrollTo) {
        scrollTo = scrollTo || false;
        el = $('#track--' + trackId);
        player = $('audio').get(0).play();

        SC.get('/tracks/' + trackId).then(function(track) {
            var url = track.stream_url + '?client_id=' + clientId;

            // Check if current track
            if (url = $('audio').attr('src')) {
                if ($('audio').get(0).paused) {
                    onPlay(el);
                } else {
                    onStop(el);
                }
            } else {
                onStop($('.is-playing'));
                $('audio').attr('src', url);
                onPlay(el);
                player.onended = function() {
                    onSkip();
                }
                player.ontimeupdate = function() {
                    updateProgressBar(player.duration, player.currentTime);
                }
                sendTrackAnalytics();
            }
        });

        if(scrollTo) {
            context.scrollToTrack(el);
        }
    };

    return {
        init: function() {
            SC.initialize({
                client_id: clientId
            });

            defaultTitle = document.title;
            // playlistTitle = $('.header__block .post-title').text();
            bindEvents();
            // ifHasId();
        }
    };
})();
