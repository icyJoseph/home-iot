const five = require('johnny-five');
const arduino = new five.Board();

const upperByte = byte => (byte > 127 ? -byte + 128 : byte);
const lowerByte = byte => (0.25 * byte) / 64;

function calcTemp(bytes) {
  console.log('Bytes read: ', bytes);
  const temperature = bytes.reduce(
    (prev, byte, index) =>
      index === 1 ? lowerByte(byte) + prev : upperByte(byte) + prev,
    0,
  );
  console.log(temperature);
}

arduino.on('ready', function() {
  const servo = new five.Servo(9);
  this.i2cConfig();
  // according to Datasheet this device by default sends data
  // on this address 0X68. The temperature registers are 11h
  // and 12h, where 11h is the decimal and 12h is the fractional part
  this.i2cReadOnce(0x68, 0x11, 2, calcTemp);
  // grab the current content -> TODO:fix later;
  const ctx = this;
  this.repl.inject({
    servo,
    temp: function() {
      ctx.i2cReadOnce(0x68, 0x11, 2, calcTemp);
    },
  });
});
