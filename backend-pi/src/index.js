const five = require('johnny-five');
const arduino = new five.Board({
  port: '/dev/rfcomm0',
});

function logger(thermometer, soil) {
  const temp = `temperature: ${thermometer.celsius} °C`;
  const humVal = 100 - (soil.value * 100) / 1023;
  const hum = `humidity: ${humVal.toFixed(2)}%`;
  console.log(temp, hum);
}

arduino.on('ready', function() {
  const thermometer = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2,
    threshold: 100,
  });

  const soil = new five.Sensor({pin: 'A0', freq: 250, threshold: 20});

  thermometer.on('change', () => logger(thermometer, soil));
  soil.on('change', () => logger(thermometer, soil));
});
