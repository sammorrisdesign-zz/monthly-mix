import Matter from 'matter-js';

const renderCover = () => {
    let isRunning = true;
    // module aliases
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    // create an engine
    const engine = Engine.create();

    // create a renderer
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

    // add walls to the world
    World.add(engine.world, [
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(0, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 100, { isStatic: true }),
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true })
    ]);

    // run the engine
    Engine.run(engine);

    // get all animatable elements and add them to the world
    const elements = document.querySelectorAll('.is-movable');
    let bodies = [];

    elements.forEach((el, i) => {
        el.setAttribute('data-left', el.offsetLeft + (el.offsetWidth / 2));
        el.setAttribute('data-top', el.offsetTop + (el.offsetHeight / 2));

        const body = Bodies.rectangle(
            el.offsetLeft + (el.offsetWidth / 2), el.offsetTop + (el.offsetHeight / 2), el.offsetWidth, el.offsetHeight, {
                frictionAir: 0.05,
                mass: 20
            }
        );

        Body.rotate(body, Math.random() * 1 - 0.5);
        Body.setAngularVelocity(body, Math.random() * 0.1 - 0.05);
        Body.applyForce(body, body.position, {
            x: Math.random() * 0.2 - 0.1,
            y: Math.random() * 0.2 - 0.1
        });

        el.id = body.id;
        bodies.push(body);
    });

    World.add(engine.world, bodies);

    engine.world.gravity.scale = 0.000001;

    // translate canvas positions to css
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

    window.requestAnimationFrame(update);

    // run the renderer
    Render.run(render);

    setTimeout(() => {
        Render.stop(render);
        isRunning = false;
    }, 1000);
}

export default {
    init: () => {
        renderCover();
    }
}