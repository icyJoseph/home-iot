const fs = require('fs');
const path = require('path');
const five = require('johnny-five');

const arduino = new five.Board({
  port: '/dev/rfcomm0',
  repl: false,
});

const state = {
  temp: null,
  hum: null,
  acc: [],
  setState({temp, hum}) {
    onDelta(temp, this.temp, 1, this.updateTemp.bind(this));
    onDelta(hum, this.hum, 1, this.updateHum.bind(this));
  },
  updateTemp(temp) {
    this.temp = temp;
    this.updateAcc();
  },
  updateHum(hum) {
    this.hum = hum;
    this.updateAcc();
  },
  updateAcc() {
    const {temp, hum, acc} = this;
    this.acc = [...acc, {temp, hum, timestamp: Date.now()}];
    if (this.acc.length === 3) {
      // save acc and clear it
      const fileName = path.resolve(__dirname, '../logs', `${Date.now()}.json`);

      fs.writeFile(fileName, JSON.stringify(this.acc), err => {
        if (err) return console.log(err);
        console.log(`Saved: ${fileName}`);
        this.acc = [];
      });
    }
  },
};

function onDelta(curr, prev, delta, callback) {
  if (prev === null) return callback(curr);
  return Math.abs(curr - prev) >= delta && callback(curr);
}

function toState({celsius}, soil) {
  const humVal = 100 - (soil.value * 100) / 1023;
  return state.setState({temp: celsius, hum: humVal});
}

arduino.on('ready', function() {
  const thermometer = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2,
    freq: 250,
  });

  const soil = new five.Sensor({pin: 'A0', freq: 250, threshold: 20});

  const onChange = () => toState(thermometer, soil);

  thermometer.on('change', onChange);
  soil.on('change', onChange);
});
