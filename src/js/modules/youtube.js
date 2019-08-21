import helpers from './player-helpers';

let youTubePlayer;

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
        playerVars: {
            'controls': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'disablekb': 1,
            'iv_load_policy': 3
        },
        events: {
            'onReady': onReady,
            'onStateChange': onStateChange
        }
    })
}

const onReady = () => {
    mediator.publish('play', helpers.getCurrentId());
}

const onStateChange = event => {
    // 0: 'ended'
    // 1: 'playing'
    // 2: 'paused'

    if (event.data === 0) {
        // Should this be play, or do we need a different ending event?
        mediator.publish('play', helpers.getNextId());
    }
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        const playingId = youTubePlayer.getVideoData().video_id;

        if (playingId === id) {
            youTubePlayer.playVideo();
        } else {
            youTubePlayer.loadVideoById(id);
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