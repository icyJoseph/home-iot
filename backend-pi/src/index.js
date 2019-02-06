const five = require('johnny-five');
const arduino = new five.Board();

arduino.on('ready', function() {
  const relay = new five.Relay(10);
  const motion = new five.Motion(7);
  // from the REPL by typing commands, eg.
  //
  // relay.on();
  //
  // relay.off();
  //

  // "calibrated" occurs once, at the beginning of a session,
  motion.on('calibrated', function() {
    console.log('calibrated motion sensor', Date.now());
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on('motionstart', function() {
    console.log('motionstart', Date.now());
    relay.on();
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on('motionend', function() {
    console.log('motionend', Date.now());
    setTimeout(() => {
      relay.off();
    }, 1000);
  });

  this.repl.inject({
    relay: relay,
  });
});
