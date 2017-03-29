var $ = require('../vendor/jquery.js');
var youtube = require('../modules/youtube.js');

module.exports =  {
    init: function() {
        youtube.init();
        this.bindings();
    },

    bindings: function() {
        $('.track').click(function(el) {
            this.play(el.currentTarget);
        }.bind(this));


        $('.controls__mute-button').click(function() {
            this.mute();
        }.bind(this));

        $('.controls__play-button').click(function() {
            this.play($('.is-playing, .is-paused'));
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

    play: function(track) {
        if ($(track).hasClass('is-playing')) {
            youtube.pauseVideo();
            $('.is-playing').addClass('is-paused').removeClass('is-playing');
        } else {
            $('.is-playing').removeClass('is-playing');
            $('.is-paused').removeClass('is-paused');
            $(track).addClass('is-playing');
            youtube.play($(track).attr('data-id'));
        }
    },

    animateLogo: function() {
        $('.logo').addClass('is-animating');
    },

    pauseLogo: function() {
        $('.logo').removeClass('is-animating');
    },

    mute: function() {
        if ($('.controls__mute-button').hasClass('is-muted')) {
            youtube.unmute();
            $('.controls__mute-button').removeClass('is-muted');
        } else {
            youtube.mute();
            $('.controls__mute-button').addClass('is-muted');
        }
    }
};
