var $ = require('../vendor/jquery.js');

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
    },

    hidePlaylist: function() {
        $('body').toggleClass('is-closed');
    },

    showSubscribe: function() {
        $('body').addClass('is-subscribing');
    },

    showArchive: function() {
        $('body').addClass('is-archiving');
    },

    hidePanel: function() {
        $('body').removeClass('is-subscribing is-archiving');
    }
};