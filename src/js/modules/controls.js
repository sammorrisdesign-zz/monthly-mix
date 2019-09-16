import helpers from './player-helpers';

let inactivityTimer;

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
    });

    document.querySelectorAll('.js-track').forEach(el => {
        el.addEventListener('click', e => {
            toggleTracklist();
            mediator.publish('play', e.currentTarget.getAttribute('data-id'));
        });
    });

    document.querySelector('.video').addEventListener('click', e => {
        if (document.querySelector('body').classList.contains('is-expanded')) {
            toggleTracklist();
        }
    })

    document.querySelector('body').addEventListener('mousemove', e => {
        if (e.target.classList.contains('video') && !document.querySelector('body').classList.contains('is-expanded')) {
            resetInactivityTimer();
        } else {
            clearTimeout(inactivityTimer);
        }
    });

    document.querySelector('.video').addEventListener('mousemove', () => {
        clearTimeout(inactivityTimer);
    });
}

const resetInactivityTimer = () => {
    document.querySelector('.controls').classList.remove('is-hidden');
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(hideControls, 5000);
}

const hideControls = () => {
    document.querySelector('.controls').classList.add('is-hidden');
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

        if (document.querySelector('.controls__tracklist-track.is-playing')) {
            document.querySelector('.controls__tracklist-track.is-playing').classList.remove('is-playing');
        }
        document.querySelector('.controls__tracklist-track[data-id="' + id  + '"]').classList.add('is-playing');
    });
}

export default {
    init: () => {
        bindings();
        subscriptions();
    }
}