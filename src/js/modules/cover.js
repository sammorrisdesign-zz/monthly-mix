import Matter from 'matter-js';
import pathseg from 'pathseg'
import decomp from 'poly-decomp'
window.decomp = decomp;

const renderCover = () => {
    // module aliases
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Svg = Matter.Svg;

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

    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    const vertexSets = [];
    const month = 'may';
    const characters = month.split('');
    const ids = characters.map(character => { return `#${character}` }).join();

    console.log(ids);
    const svg = document.querySelectorAll(ids);
    svg.forEach((node, i) => {
        const v = Bodies.fromVertices(100+(i*150), 200, Svg.pathToVertices(node, 1), {
            render: {
              fillStyle: '#ffffff',
              strokeStyle: '#ffffff',
              lineWidth: 1
            },
            frictionAir: 0.05,
            mass: 20
          }, true, 0);

        Body.setAngularVelocity(v, 0.02);
        Body.applyForce(v, v.position, {
            x: 0.01,
            y: 0.02
        });

        vertexSets.push(v);
    })

    engine.world.gravity.scale = 0.000001;

    // add all of the bodies to the world
    World.add(engine.world, vertexSets);

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