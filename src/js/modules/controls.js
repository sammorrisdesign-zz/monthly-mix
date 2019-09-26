import helpers from './player-helpers';
import analytics from './analytics';

const body = document.querySelector('body');
const options = {
    'js-tracklist': 'is-expanded',
    'js-subscribe': 'is-subscribing',
    'js-archive': 'is-archiving'
};

let inactivityTimer;

const bindings = () => {
    document.querySelector('.js-cover').addEventListener('click', () => {
        document.querySelector('body').classList.remove('is-cover');
        analytics.send('cover');
        mediator.publish('play', helpers.getCurrentId());
    });

    document.querySelector('.js-play').addEventListener('click', () => {
        mediator.publish('toggle');
        analytics.send('play button');
    });

    document.querySelector('.js-prev').addEventListener('click', () => {
        mediator.publish('play', helpers.getPreviousId());
        analytics.send('prev');
    })

    document.querySelector('.js-next').addEventListener('click', () => {
        mediator.publish('play', helpers.getNextId());
        analytics.send('next');
    });

    document.querySelector('.js-select').addEventListener('change', () => {
        mediator.publish('play', helpers.getCurrentId());
    });

    document.querySelectorAll('.js-track').forEach(el => {
        el.addEventListener('click', e => {
            clearNavigationStates();
            mediator.publish('play', e.currentTarget.getAttribute('data-id'));
        });
    });

    document.querySelector('.video').addEventListener('click', e => {
        if (Object.values(options).some(className => body.classList.contains(className))) {
            clearNavigationStates();
        }
    })

    body.addEventListener('mousemove', e => {
        if (e.target.classList.contains('video') && !Object.values(options).some(className => body.classList.contains(className))) {
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
    document.querySelector('.navigation').classList.remove('is-hidden');
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(hideControls, 5000);
}

const hideControls = () => {
    document.querySelector('.navigation').classList.add('is-hidden');
}

const clearNavigationStates = () => {
    body.classList.remove(...Object.values(options));
}

const navigationStates = () => {
    Object.keys(options).forEach(target => {
        const targetClassName = options[target];

        document.querySelector('.' + target).addEventListener('click', () => {
            if (body.classList.contains(targetClassName)) {
                body.classList.remove(targetClassName)
            } else {
                analytics.send(target.replace('js-', ''));

                let timeUntilAdd = 0;
                if (Object.values(options).some(className => body.classList.contains(className))) {
                    clearNavigationStates();
                    timeUntilAdd = 300;
                }
                setTimeout(() => {
                    body.classList.add(targetClassName);
                }, timeUntilAdd)
            }
        })
    });
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

    mediator.subscribe('pause', () => {
        clearNavigationStates();
    });
}

export default {
    init: () => {
        bindings();
        subscriptions();
        navigationStates();
    }
}