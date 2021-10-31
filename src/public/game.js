try {
  const Matter = require("matter-js");
  window.require = () => { Socket: { } };
  const { Socket } = require("socket.io");
} catch (e) { }

document.addEventListener('alpine:init', () => {

  const ip = document.getElementById('socketip').value;
  /** @type { Socket } */
  const socket = io(ip);

  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();
  engine.gravity = new Matter.Vector.create(0, .98)
  // create a renderer
  var render = Render.create({
    element: document.getElementById('scene'),
    engine: engine,
    options: {
      wireframes: true,
      height: 400,
      width: 800
    }
  });
  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 80, 80);
  var boxB = Bodies.rectangle(450, 50, 80, 80);
  var ground = Bodies.rectangle(400, 400, 1000, 60, { isStatic: true });


  let player = Bodies.circle(10, 10, 20, { mass: 2, restitution: 0.5 });

  document.addEventListener('keypress', (e) => {
    switch (e.code) {
      case 'KeyA':
        Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: -0.05, y: 0 })
        socket.emit('move', 'left')
        break;
      case 'KeyD':
        Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: 0.05, y: 0 })
        socket.emit('move', 'right')
        break;
      case 'Space':
      case 'KeyW':
        Matter.Body.applyForce(player, { x: player.position.x, y: player.position.y }, { x: 0, y: -0.05 })
        socket.emit('move', 'top')
        break;
    }
  });

  socket.on('move', (e) => {
    console.log(e);
  })

  const UIConsole = {

    /** @type {string[]} - all the messages received */
    _messages: [] = [],

    get messages() {
      document.getElementById('console').scrollTo(0, document.body.scrollHeight);
      return this._messages;
    },

    set messages(value) {
      this._messages = value;
    },

    /** @type {string} - the message written in the textbox */
    message: '',

    init() {
      // Receive message
      socket.on('message', (data) => {
        this.messages.push(data);
      })

      // Player connected
      socket.on('player-connected', (playerid) => {
        this.messages.push('[+] ' + playerid);
      })

      // Player disconnected
      socket.on('player-disconnected', (playerid) => {
        this.messages.push('[-] ' + playerid);
      })


      
    },

    /** 
     * @function
     * @param {string} msg - the message to send
     */
    sendMessage(msg) {

      socket.emit('message', msg);
    },

  }  

  Alpine.data('console', () => (UIConsole))
  
  // add all of the bodies to the world
  Composite.add(engine.world, [player, boxA, boxB, ground]);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
})

