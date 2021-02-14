// use events module
var events = require("events");

// EventEmitter object create
var eventEmitter = new events.EventEmitter();

// EventHandler function make
var connectHandler = function connected() {
  console.log("Connection Successful");

  // data_received event occur
  eventEmitter.emit("data_received");
};

// connection event and connectHandler bind
eventEmitter.on("connection", connectHandler);

// data_received and anonymous function bind
eventEmitter.on("data_received", function () {
  console.log("Data Received");
});

// connection event occur
eventEmitter.emit("connection");

console.log("Program has endeed");
