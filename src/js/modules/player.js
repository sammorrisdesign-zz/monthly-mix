var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');
var youtube = require('../modules/youtube.js');

var isMuted = true;

module.exports =  {
    init: function() {
        youtube.init();
        this.bindings();
    },

    bindings: function() {
        $('.track').click(function(el) {
            this.play(el.currentTarget, true);
        }.bind(this));

        $('.play-button').click(function() {
            this.play($('.is-playing, .is-paused'), true);
        }.bind(this));

        // manage play events
        $('body').one('ready', function() {
            this.play($('.track')[0]);
        }.bind(this));

        $('body').on('ended', function() {
            this.play($('.is-playing').next()[0] ? $('.is-playing').next() : $('.track')[0]);
        }.bind(this));

        $('body').on('play', function() {
            this.animateLogo();
        }.bind(this))

        $('body').on('pause', function() {
            this.pauseLogo();
        }.bind(this));
    },

    play: function(track, unMute = false) {
        if (isMuted) {
            $('.is-playing').removeClass('is-playing');
            $(track).addClass('is-playing');
            youtube.play($(track).attr('data-id'), unMute);

            if (unMute) {
                isMuted = false;
                $('.play-button').text('Pause');
            }
        } else {
            if ($(track).hasClass('is-playing')) {
                console.log('hey');
                youtube.pauseVideo();
                $('.play-button').text('Play');
                $('.is-playing').addClass('is-paused').removeClass('is-playing');
            } else {
                $('.is-playing').removeClass('is-playing');
                $('.is-paused').removeClass('is-paused');
                $(track).addClass('is-playing');
                $('.play-button').text('Pause');
                youtube.play($(track).attr('data-id'), unMute);
                analytics.newTrack($(track).text(), $(document).find("title").text());
            }
            this.updateYouTubeButton($(track).attr('data-id'));
        }
    },

    animateLogo: function() {
        $('.logo').addClass('is-animating');
    },

    pauseLogo: function() {
        $('.logo').removeClass('is-animating');
    },

    updateYouTubeButton: function(id) {
        $('.playlist__youtube-button').attr('href', 'https://www.youtube.com/watch?v=' + id + '&list=' + $('.playlist').attr('data-id'));
    }
};
