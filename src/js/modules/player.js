import helpers from './player-helpers';
import analytics from './analytics';

let isPlaying = false,
    defaultTitle = document.title;

const bindings = () => {
    let body = document.querySelector('body');

    body.addEventListener('ready', () => {
        removeEventListener('ready', body);

        const event = new Event('play');
        document.querySelector('body').dispatchEvent(event);
    });

    body.addEventListener('keypress', e => {
        if (e.keyCode === 32) {
            e.preventDefault();
            analytics.send('space play');
            mediator.publish('toggle');
        }
    });
}

const subscriptions = () => {
    mediator.subscribe('ready', () => {
        document.querySelector('body').classList.add('is-ready');
        document.querySelector('body').classList.add('has-loaded');
    });

    mediator.subscribe('play', id => {
        isPlaying = true;
        document.querySelector('body').classList.add('is-playing');
        document.querySelector('body').classList.remove('is-paused');
        document.querySelector('body').classList.remove('is-cover');

        const currentTrack = document.querySelector('.controls__tracklist-track[data-id="' + id + '"]');

        document.title = currentTrack.querySelector('.controls__tracklist-artist').textContent + ' – ' + currentTrack.querySelector('.controls__tracklist-title').textContent + ' | ' + defaultTitle
    });

    mediator.subscribe('pause', () => {
        isPlaying = false;
        document.querySelector('body').classList.add('is-paused');
        document.querySelector('body').classList.remove('is-playing');
        document.querySelector('body').classList.add('is-cover');
    })

    mediator.subscribe('toggle', () => {
        if (isPlaying) {
            mediator.publish('pause');
        } else {
            mediator.publish('play', helpers.getCurrentId());
        }
    })
}

export default {
    init: () => {
        bindings();
        subscriptions()
    }
}