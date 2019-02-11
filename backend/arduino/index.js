const fs = require('fs');
const path = require('path');
const five = require('johnny-five');
const io = require('socket.io')();

io.on('connection', client => {
  console.log('New client', client.handshake.headers.origin);
});

io.listen(1337);

const arduino = new five.Board({
  //  port: '/dev/rfcomm0',
  repl: false,
});

const state = {
  temp: null,
  hum: null,
  acc: [],
  setState({temp, hum}) {
    this.temp = temp;
    this.hum = hum;
    return this.updateAcc();
  },
  updateAcc() {
    const {temp, hum, acc} = this;
    this.acc = [...acc, {temp, hum, timestamp: Date.now()}];
    if (this.acc.length === 50) {
      // save acc and clear it
      flushOut(this.acc);
      this.acc = [];
    }
    return null;
  },
};

function flushOut(data) {
  const fileName = path.resolve(__dirname, '../logs', `${Date.now()}.json`);
  return fs.writeFile(fileName, JSON.stringify(data), err => {
    if (err) return console.log(err);
    return console.log(`Saved: ${fileName}`);
  });
}

const scaleHum = ({value}) => 100 - (value * 100) / 1023;

arduino.on('ready', function() {
  console.log('Arduino Ready');
  const thermometer = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2,
    freq: 250,
  });
  const soil = new five.Sensor({pin: 'A0', freq: 250, threshold: 20});

  const onChange = () => {
    const hum = scaleHum(soil);
    const {celsius: temp} = thermometer;
    const payload = {temp, hum};
    // emit socket io event
    io.emit('change', {...payload, timestamp: Date.now()});
    // set the state
    return state.setState(payload);
  };

  thermometer.on('change', onChange);
  soil.on('change', onChange);

  arduino.on('exit', function() {
    return state.acc.length > 0 ? flushOut(state.acc) : null;
  });
  process.on('exit', function() {
    return state.acc.length > 0 ? flushOut(state.acc) : null;
  });
});
