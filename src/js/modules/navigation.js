var $ = require('../vendor/jquery.js');

module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.playlist__hide-button').click(function() {
            this.hidePlaylist();
        }.bind(this));
    },

    hidePlaylist: function() {
        $('body').toggleClass('is-closed');
    }
};