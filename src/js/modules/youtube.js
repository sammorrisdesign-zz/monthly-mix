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
    const readyEvent = new Event('ready');
    document.querySelector('body').dispatchEvent(readyEvent);
}

const onStateChange = event => {
    const states = {
        0: 'ended',
        1: 'playing',
        2: 'ended'
    }
    const state = states[event.data];

    if (state) {
        const event = new Event('state');
        document.querySelector('body').dispatchEvent(event);
    }
}

export default {
    init: () => {
        createYouTubeAPI();
    },

    play: id => {
        const currentId = youTubePlayer.getVideoData().video_id;

        if (id === currentId) {
            youTubePlayer.playVideo();
        } else {
            youTubePlayer.loadVideoById(id);
        }
    }
}