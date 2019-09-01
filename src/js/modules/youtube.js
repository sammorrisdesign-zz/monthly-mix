import helpers from './player-helpers';

let youTubePlayer,
    throttle = true;

const createYouTubeAPI = () => {
    const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
    document.querySelector('script').insertBefore(tag, null);

    window.onYouTubePlayerAPIReady = () => {
        createPlayer();
    }
}

const createPlayer = () => {
    youTubePlayer = new YT.Player('video-player', {
        height: '360',
        width: '640',
        playerVars: {
            'controls': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'disablekb': 1,
            'iv_load_policy': 3
        },
        events: {
            'onReady': onReady,
            'onStateChange': onStateChange,
            'onError': onError
        }
    })
}

const onReady = () => {
    mediator.publish('ready');
    mediator.publish('play', helpers.getCurrentId());
}

const onStateChange = event => {
    if (event.data === 0) {
        // throttled because YT fires 'ended' event twice
        if (throttle) {
            mediator.publish('play', helpers.getNextId());
            throttle = false;

            setTimeout(function() {
                throttle = true;
            }, 100);
        }
    }
}

const onError = () => {
    // This should maybe flag something to the listener?
    mediator.publish('play', helpers.getNextId());
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        const playingId = youTubePlayer.getVideoData().video_id;

        if (playingId === id) {
            youTubePlayer.playVideo();
        } else {
            youTubePlayer.loadVideoById({videoId: id});
        }
    });

    mediator.subscribe('pause', () => {
        youTubePlayer.pauseVideo();
    })
}

export default {
    init: () => {
        createYouTubeAPI();
        subscriptions();
    }
}