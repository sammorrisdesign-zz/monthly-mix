import Matter from 'matter-js';

const renderCover = () => {
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
            background: 'transparent',
            wireframes: false
        }
    });

    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 80, 80, { frictionAir: 0.05 } );
    const boxB = Bodies.rectangle(550, 190, 80, 80, { frictionAir: 0.05 });
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    engine.world.gravity.scale = 0.000001;

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);
    Body.setAngularVelocity(boxA, 0.02);
    Body.applyForce(boxA, boxA.position, {
        x: 0.01,
        y: 0.02
    });

    Body.setAngularVelocity(boxB, -0.02);
    Body.applyForce(boxB, boxB.position, {
        x: -0.01,
        y: -0.02
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
}

export default {
    init: () => {
        renderCover();
    }
}