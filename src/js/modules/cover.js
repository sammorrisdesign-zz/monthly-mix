import Matter from 'matter-js';

const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

let elements,
    engine,
    bodies = [],
    isRunning = true;

const isDebug = false;

const randomForce = () => {
    return Math.random() * 0.06 - 0.03;
}

const renderCover = () => {
    // create engine and renderer
    engine = Engine.create();
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

    // add walls to the world
    World.add(engine.world, [
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(0, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 14, 0, window.innerWidth / 5, window.innerWidth / 4, { isStatic: true })
    ]);

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

        Body.rotate(body, Math.random() * 0.5 - 0.25);
        Body.setAngularVelocity(body, randomForce());

        el.id = body.id;
        bodies.push(body);
    });

    World.add(engine.world, bodies);

    // run the renderer
    mediator.subscribe('ready', () => {
        Engine.run(engine);
        window.requestAnimationFrame(update);
        pauseAfter(10000);
    });
}

const subscriptions = () => {
    mediator.subscribe('pause', () => {
        bodies.forEach(body => {
            body.isStatic = false;
            Body.rotate(body, Math.random() * 0.5 - 0.25);
            Body.setAngularVelocity(body, randomForce());

        });

        isRunning = true;
        window.requestAnimationFrame(update);
        pauseAfter(3000);
    });
}

const update = () => {
    elements.forEach((el, i) => {
        let body = null;
        bodies.forEach((b, id) => {
            if (b.id == el.id) {
                body = b;
            }
        });

        el.style.transform = `translateX(${body.position.x - el.getAttribute('data-left')}px) translateY(${body.position.y - el.getAttribute('data-top')}px) rotate(${body.angle}rad)`;
    });

    if (isRunning) {
        window.requestAnimationFrame(update);
    }
}

const onResize = () => {
    // do something to fix it.
}

const pauseAfter = length => {
    setTimeout(() => {
        bodies.forEach(body => {
            body.isStatic = true;
        });
        isRunning = false;
    }, length);
}

const bindings = () => {
    window.addEventListener('resize', () => {
        onResize();
    })
}

export default {
    init: () => {
        renderCover();
        bindings();
        subscriptions();
    }
}