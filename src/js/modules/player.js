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
            $('.is-playing').removeClass('is-playing');
        } else {
            $('.is-playing').removeClass('is-playing');
            $(track).addClass('is-playing');
            youtube.play($(track).attr('data-id'));
        }
    },

    animateLogo: function() {
        $('.logo').addClass('is-animating');
    },

    pauseLogo: function() {
        $('.logo').removeClass('is-animating');
    }
};