var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.playlist__hide-button').click(function() {
            this.hidePlaylist();
        }.bind(this));

        $('.header__button').click(function() {
            this.showPanel();
        }.bind(this));

        $('.page-fade').click(function() {
            this.hidePanel();
        }.bind(this));
    },

    hidePlaylist: function() {
        $('body').toggleClass('is-closed');
    },

    showPanel: function() {
        $('body').addClass('is-subscribing');
    },

    hidePanel: function() {
        $('body').removeClass('is-subscribing');
    }
};