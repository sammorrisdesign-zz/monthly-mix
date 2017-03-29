var $ = require('../vendor/jquery.js');

var timer;

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.playlist__hide-button').click(function() {
            this.hidePlaylist();
        }.bind(this));

        $('.header__subscribe-button').click(function() {
            this.showSubscribe();
        }.bind(this));

        $('.header__archive-button').click(function() {
            this.showArchive();
        }.bind(this));

        $('.page-fade').click(function() {
            this.hidePanel();
        }.bind(this));

        $(window).mousemove(function() {
            this.showControls();
        }.bind(this));
    },

    hidePlaylist: function() {
        $('body').toggleClass('is-closed');

        if ($('body').hasClass('is-closed')) {
            $('.playlist__hide-button').text('Show Playlist');
            this.showControls();
        } else {
            $('.playlist__hide-button').text('Hide Playlist');
        }
    },

    showSubscribe: function() {
        $('body').addClass('is-subscribing');
    },

    showArchive: function() {
        $('body').addClass('is-archiving');
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