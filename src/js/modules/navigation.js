var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');
var player = require('../modules/player');

var timer;

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.playlist__hide-button .button').click(function() {
            this.hidePlaylist();
        }.bind(this));

        $('.header__subscribe-button').click(function() {
            this.showSubscribe();
        }.bind(this));

        $('.header__archive-button').click(function() {
            this.showArchive();
        }.bind(this));

        $('.page-fade, .archive__hide-button, .subscribe__hide-button').click(function() {
            this.hidePanel();
        }.bind(this));

        $('.video-mask').click(function() {
            console.log('video mask');
            if ($('body').hasClass('is-closed')) {
                console.log('is-closed');
                player.play($('.is-playing, .is-paused'));
            } else {
                console.log('hide the playlist');
                this.hidePlaylist();
            }
        }.bind(this));

        $(window).mousemove(function() {
            this.showControls();
        }.bind(this));
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

    showSubscribe: function() {
        $('body').addClass('is-subscribing');
        analytics.click('subscribe');
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
        clearInterval(timer);

        if ($('body').hasClass('is-closed')) {
            timer = setInterval(function() {
                $('body').removeClass('show-controls');
            }, 3000);
        }
    }
};