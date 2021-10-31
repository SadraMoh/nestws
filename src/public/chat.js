try {
  window.require = () => { Socket: { } };
  const { Socket } = require("socket.io");
} catch (e) { }

const ip = document.getElementById('socketip').value;

/** @type { Socket } */
const socket = io(ip);

document.addEventListener('alpine:init', () => {
  Alpine.data('chat', () => ({

    /** @type {string[]} - all the messages received */
    messages: [],

    /** @type {string} - the message written in the textbox */
    message: '',

    init() {
      // Receive message
      socket.on('message', (data) => {
        this.messages.push(data);
      })
    },

    /** 
     * @function
     * @param {string} msg - the message to send
     */
    sendMessage(msg) {


      socket.emit('message', msg);
    },

  }))
})
