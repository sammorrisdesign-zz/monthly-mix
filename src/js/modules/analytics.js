var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-3361191-12', 'auto');
        ga('send', 'pageview');

        this.bindings();
    },

    bindings: function() {
        $('.playlist-header__link--spotify').click(function() {
            this.click('spotify')
        }.bind(this));

        $('.playlist-header__link--youtube').click(function() {
            this.click('youtube')
        }.bind(this));

        $('.playlist__youtube-button').click(function() {
            this.click('watch on youtube')
        }.bind(this));
    },

    newTrack: function(track, playlist) {
        ga('send', 'event', 'play', track + ' from ' + playlist);
    },

    click: function(buttonTitle) {
        ga('send', 'event', 'click', buttonTitle);
        console.log(buttonTitle);
    }
}
