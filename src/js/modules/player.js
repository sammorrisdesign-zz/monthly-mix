import helpers from './player-helpers';

let isPlaying = false,
    isFirst = true;

const bindings = () => {
    let body = document.querySelector('body');

    body.addEventListener('ready', () => {
        removeEventListener('ready', body);

        const event = new Event('play');
        document.querySelector('body').dispatchEvent(event);
    });

    body.addEventListener('keypress', e => {
        e.preventDefault();
        if (e.keyCode === 32) {
            mediator.publish('toggle');
        }
    });
}

const subscriptions = () => {
    mediator.subscribe('ready', () => {
        document.querySelector('body').classList.add('is-ready');
    });

    mediator.subscribe('play', id => {
        isPlaying = true;
        document.querySelector('body').classList.add('is-playing');
        document.querySelector('body').classList.remove('is-paused');

        if (!isFirst) {
            document.querySelector('body').classList.remove('is-cover');
        }

        isFirst = false;
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