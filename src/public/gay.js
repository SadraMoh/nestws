try {
  const Matter = require("matter-js");
  window.require = () => { Socket: { } };
  const { Socket } = require("socket.io");
} catch (e) { }

//#region

const ip = document.getElementById('socketip').value;
/** @type { Socket } */
const socket = io(ip);

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;
//- Hello

// create an engine
var engine = Engine.create({
  gravity: Matter.Vector.create(0, 0),
});

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false
  }
});

//#endregion

const world = { width: 800, height: 600 }

const paddle = { width: world.width * 0.2, height: 20 }

//- paddles
const paddleTop = Bodies.rectangle(100, 50, paddle.width, paddle.height,
  {
    isStatic: true,
    render: {
      fillStyle: 'cyan'
    }
  });
const paddleBottom = Bodies.rectangle(100, world.height - 50, paddle.width, paddle.height,
  {
    isStatic: true,
    render: {
      fillStyle: 'magenta'
    }
  });


paddleTop.frictionAir =
  paddleBottom.frictionAir =
  paddleBottom.frictionStatic =
  paddleTop.frictionStatic = 0;

paddleTop.restitution = paddleBottom.restitution = 1;

//- walls
const wallLeft = Bodies.rectangle(1, world.height / 2, 1, world.height, { isStatic: true });
const wallRight = Bodies.rectangle(world.width - 1, world.height / 2, 1, world.height, { isStatic: true });

//- sensors

const ball = { size: 16 }

//- ball
const ballCenter = Bodies.circle((world.width + ball.size) / 2, (world.height + ball.size) / 2, ball.size, ball.size);
ballCenter.restitution = 1.005;
ballCenter.frictionAir = 0;
ballCenter.frictionStatic = 0;
ballCenter.friction = 0;
ballCenter.collisionFilter.group = 1;

Matter.Body.applyForce(ballCenter, { x: ballCenter.position.x, y: ballCenter.position.y }, { x: -0.004, y: -0.007 })


const objects = [paddleTop, paddleBottom, wallLeft, wallRight, ballCenter];

function playerBottomWins() {
  Matter.Body.setPosition(ballCenter, Matter.Vector.create(world.width / 2, world.height / 2));
}

function playerTopWins() {
  Matter.Body.setPosition(ballCenter, Matter.Vector.create(world.width / 2, world.height / 2));
}

setInterval(() => {

  if (ballCenter.position.y < 0) {
    playerBottomWins();
  } else if (ballCenter.position.y > world.height) {
    playerTopWins();
  }

}, 2);


const canvas = document.querySelector('canvas');

let playerType = -1;

socket.on('assign', (type) => {

  console.log(type);
  playerType = type;

});

socket.on('move', (j) => {

  /** @type { movement } */
  const movement = JSON.parse(j);

  if (movement.p == 0) {

    Matter.Body.setPosition(paddleTop, Matter.Vector.create(movement.x, paddleTop.position.y));

  } else if (movement.p == 1) {

    Matter.Body.setPosition(paddleBottom, Matter.Vector.create(movement.x, paddleBottom.position.y));

  }

})

window.addEventListener('mousemove', (e) => {
  const offset = e.clientX - canvas.offsetLeft;

  socket.emit('move', JSON.stringify({ x: offset, p: playerType }));

})

//#region 

// add all of the bodies to the world
Composite.add(engine.world, objects);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

//#endregion