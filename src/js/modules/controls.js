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

    document.querySelector('.js-select').addEventListener('change', () => {
        mediator.publish('play', helpers.getCurrentId());
    });

    document.querySelector('.js-tracklist').addEventListener('click', () => {
        toggleTracklist();
    })
}

const toggleTracklist = () => {
    if (document.querySelector('body').classList.contains('is-expanded')) {
        document.querySelector('body').classList.remove('is-expanded');
    } else {
        document.querySelector('body').classList.add('is-expanded');
    }
}

const subscriptions = () => {
    mediator.subscribe('play', id => {
        document.querySelector('.controls__select').value = id;

        const data = document.querySelector('.controls__select option:checked').dataset;
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