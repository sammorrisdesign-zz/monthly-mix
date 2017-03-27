var $ = require('../vendor/jquery.js');

var youTubePlayer, playFirstTrack, throttle = true;

module.exports =  {
    init: function() {
        var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubePlayerAPIReady = function() {
          this.createPlayer();
        }.bind(this);
    },

    play: function(url) {
        if (this.isPlaying()) {
            this.pauseVideo();
        } else {
            this.playVideo(url);
        }
    },

    createPlayer: function() {
        youTubePlayer = new YT.Player('video-player', {
            height: '270',
            width: '480',
            playerVars: {
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'playsinline': 1
            },
            events: {
                'onReady': this.onReady,
                'onStateChange': this.onStateChange
            }
        });
    },

    getId: function(url) {
        return url.split('?v=')[1];
    },

    onReady: function() {
        $('body').trigger('ready');
    },

    onStateChange: function(event) {
        var state = event.data;

        // ended
        if (state === 0) {
            if (throttle == true) {
                $(body).trigger('ended');
                throttle = false;
                setTimeout(function() {
                    throttle = true;
                }, 5000);
            }
        }

        // playing
        if (state === 1) {
            $(body).trigger('playing');
        }

        // paused
        if (state === 2) {
            $(body).trigger('paused');
        }
    },

    playVideo: function(id) {
        if (youTubePlayer.getVideoData().video_id) {
            if (id === youTubePlayer.getVideoData().video_id) {
                youTubePlayer.playVideo();
            } else {
                youTubePlayer.loadVideoById(id);
                // youTubePlayer.loadVideoById({videoId: this.getId(url), startSeconds: 10, endSeconds: 15});
            }
        } else {
            youTubePlayer.loadVideoById(id);
        }
    },

    pauseVideo: function() {
        youTubePlayer.pauseVideo();
    },

    stopVideo: function() {
        if (youTubePlayer !== undefined) {
            this.updatePlayingStatus(false);
        }
    },

    isPlaying: function() {
        return ($('.sound-of').attr('data-playing') == 'true');
    }
};