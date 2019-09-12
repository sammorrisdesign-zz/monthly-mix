import Matter from 'matter-js';

const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

let elements,
    mouse,
    mouseConstraint,
    engine,
    bodies = [],
    isRunning = true;

const isDebug = true;

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

    console.log(Mouse);
    mouse = Mouse.create();
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.6,
            length: 0,
            angularStiffness: 0,
            render: {
                visible: false
            }
        }
    });

    Events.on(mouseConstraint, 'startdrag', e => {
        console.log(e);
    });

    World.add(engine.world, mouseConstraint);

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
        Engine.run(engine);
        window.requestAnimationFrame(update);
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

const pause = length => {
    isRunning = false;
}

const bindings = () => {
    window.addEventListener('resize', () => {
        onResize();
    });
}

export default {
    init: () => {
        renderCover();
        bindings();
        subscriptions();
    }
}