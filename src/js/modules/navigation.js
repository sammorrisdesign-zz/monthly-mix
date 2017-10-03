var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');
var player = require('../modules/player');

var timer;

module.exports =  {
    init: function() {
        this.bindings();
        this.setTimer();
    },

    bindings: function() {
        $('.playlist__hide-button .button').click(function() {
            this.hidePlaylist();
        }.bind(this));

        $('.header__archive-button').click(function() {
            this.showArchive();
        }.bind(this));

        $('.page-fade, .archive__hide-button, .subscribe__hide-button').click(function() {
            this.hidePanel();
        }.bind(this));

        $('.video-mask').click(function() {
            if ($('body').hasClass('is-closed')) {
                player.play($('.is-playing, .is-paused'));
            } else {
                this.hidePlaylist();
            }
        }.bind(this));

        $(window).scroll(function() {
            this.setTimer();
        }.bind(this));

        $(window).mousemove(function() {
            this.showControls();
            if ($('.playlist__hover-zone').is(':hover')) {
                console.log('in the hover zone');
                $('body').removeClass('is-closed');
            }
        }.bind(this));
    },

    setTimer: function() {
        clearInterval(timer);

        if ($('body').hasClass('is-active') && !$('.playlist').is(':hover') && !$('.play-button').is(':hover')) {
            timer = setInterval(function() {
                $('body').removeClass('show-controls');
                $('body').addClass('is-closed');
            }, 1000);
        }
    },

    hidePlaylist: function() {
        $('body').toggleClass('is-closed');
        analytics.click('hide playlist');

        if ($('body').hasClass('is-closed')) {
            $('.playlist__hide-button .button').text('Show Tracklist');
            this.showControls();
        } else {
            $('.playlist__hide-button .button').text('Hide Tracklist');
        }
    },

    showArchive: function() {
        $('body').addClass('is-archiving');
        analytics.click('archive');
    },

    hidePanel: function() {
        $('body').removeClass('is-subscribing is-archiving');
    },

    showControls: function() {
        $('body').addClass('show-controls');
        this.setTimer();
    }
};