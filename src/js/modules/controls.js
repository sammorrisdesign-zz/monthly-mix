import helpers from './player-helpers';

const bindings = () => {
    document.querySelector('.js-cover').addEventListener('click', () => {
        document.querySelector('body').classList.remove('is-cover');
        mediator.publish('play', helpers.getCurrentId());
    });

    document.querySelector('.js-play').addEventListener('click', () => {
        mediator.publish('toggle');
    });

    document.querySelector('.js-prev').addEventListener('click', () => {
        mediator.publish('play', helpers.getPreviousId());
    })

    document.querySelector('.js-next').addEventListener('click', () => {
        mediator.publish('play', helpers.getNextId());
    });

    document.querySelector('.js-track-list').addEventListener('change', () => {
        mediator.publish('play', helpers.getCurrentId());
    });
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        document.querySelector('.controls__track-list').value = id;

        const data = document.querySelector('.controls__track-list option:checked').dataset;
        document.querySelector('.controls__track-artist').innerHTML = data.artist;
        document.querySelector('.controls__track-title').innerHTML = data.title;
    });
}

export default {
    init: () => {
        bindings();
        subscriptions();
    }
}