import Matter from 'matter-js';

const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Sleeping = Matter.Sleeping;

let elements,
    engine,
    bodies = [],
    isFirst = true,
    isRunning = true;

const isDebug = false;

const randomForce = reducedMovement => {
    if (reducedMovement) {
        return Math.random() * 0.03 - 0.015;
    } else {
        return Math.random() * 0.06 - 0.03;
    }
}

const renderCover = () => {
    // create engine and renderer
    engine = Engine.create();
    engine.enableSleeping = true;
    engine.world.gravity.scale = 0;

    if (isDebug) {
        const Render = Matter.Render;
        const render = Render.create({
            element: document.querySelector('.cover'),
            engine: engine,
            options: {
                height: window.innerHeight,
                width: window.innerWidth,
                wireframeBackground: 'transparent',
                background: 'transparent'
            }
        });
        Render.run(render);
    }

    // add walls to bodies
    bodies.push(
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(0, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 14, 0, window.innerWidth / 5, window.innerWidth / 4, { isStatic: true })
    );

    // get all animatable elements and add them to the world
    elements = document.querySelectorAll('.is-movable');

    elements.forEach((el, i) => {
        el.setAttribute('data-left', el.offsetLeft + (el.offsetWidth / 2));
        el.setAttribute('data-top', el.offsetTop + (el.offsetHeight / 2));

        const body = Bodies.rectangle(
            el.offsetLeft + (el.offsetWidth / 2), el.offsetTop + (el.offsetHeight / 2), el.offsetWidth, el.offsetHeight, {
                density: 100
            }
        );

        const reduceMovement = el.classList.contains('cover__featuring') || el.classList.contains('cover__intro');

        Body.rotate(body, Math.random() * 0.5 - 0.25);
        Body.setAngularVelocity(body, randomForce(reduceMovement));

        el.id = body.id;
        bodies.push(body);
    });

    World.add(engine.world, bodies);

    // run the renderer
    mediator.subscribe('ready', () => {
        bindings();
        subscriptions();
        Engine.run(engine);
        window.requestAnimationFrame(update);
    });
}

const update = () => {
    isRunning = false;

    elements.forEach((el, i) => {
        let body = null;
        bodies.forEach((b, id) => {
            if (b.id == el.id) {
                body = b;
            }

            if (!b.isSleeping) {
                isRunning = true;
            }
        });

        el.style.transform = `translateX(${body.position.x - el.getAttribute('data-left')}px) translateY(${body.position.y - el.getAttribute('data-top')}px) rotate(${body.angle}rad)`;
    });

    if (isRunning) {
        window.requestAnimationFrame(update);
    }
}

let resizeTimer;
const onResize = () => {
    document.querySelector('body').classList.remove('is-ready');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.querySelector('body').classList.add('is-ready');
        bodies = [];
        renderCover();
        Engine.run(engine);
        window.requestAnimationFrame(update);
    }, 500);
}

const bindings = () => {
    window.addEventListener('resize', () => {
        onResize();
    });
}

const subscriptions = () => {
    mediator.subscribe('pause', () => {
        bodies.forEach(body => {
            if (!body.isStatic) {
                Sleeping.set(body, false);
                Body.setAngularVelocity(body, randomForce());
            }
        });

        isRunning = true;
        window.requestAnimationFrame(update);
    });

    mediator.subscribe('play', () => {
        if (isFirst) {
            isFirst = false;
        } else {
            isRunning = false;
        }
    });
}

export default {
    init: () => {
        renderCover();
    }
}