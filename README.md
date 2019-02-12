# Home IoT

This project uses two sensors:

- A soil humidity sensor
- A thermometer

These collect data from a plant and the air temperature around it.

And it uses two controllers:

- `Raspberry PI`
- `Arduino UNO`

## Architecture

The two sensors are connected to an `Arduino UNO` board.

The `Arduino UNO` board is running tethered, via serial-bluetooth or serial-USB to computer running [`Johnny-Five`](http://johnny-five.io/).

`Johnny-Five` is a JavaScript library, which allows us to communicate with an `Arduino` or `Raspberry PI`.

In this case, the `Arduino UNO` board is tethered to a `Raspberry PI`.

### Raspberry PI

The `Raspberry PI`, is a higher order instance in this architecture. Through a `nodejs` script it invokes the `Johnny-Five` library to setup an `Arduino UNO` instance, and then configures how to behave upon successful connection, `ready` state.

The `ready` state furthermore triggers the configuration of two sensor interfaces and indicates how to react when the readings change.

This changes are stored, and every 50 data points a log file is created. Every time there is a change, a change event is emitted using `SocketIO` through port `1337`.

### Arduino UNO board

The `Arduino UNO` board is running `configurableFirmdata` firmware, to handle 1-wire digital read outs.

The board is also enabled to use an `HC-06` as bluetooth slave to remotely reach other devices and have its data be consumed through a serial port. This is in practice a bluetooth to serial.

However, for testing and because of stability issues the board is currently using its serial to USB interface.

### Soil Humidity Sensor

This sensors offers analog output. It follows then that the precision depends on the ADC number of bits.
For this setup ten bits are used, meaning that the peak reading is 1023, and that should indicate 100% humidity.

```javascript
const soil = new five.Sensor({ pin: "A0", freq: 250, threshold: 20 });
```

> More on the sensor [here](https://learn.sparkfun.com/tutorials/soil-moisture-sensor-hookup-guide/all).

### DS18B20 - Thermometer

This sensor offers a digital interface to read its 12 bits register for temperature. Therefore it is connected to a digital input, D2 in the Arduino UNO board.

```javascript
const thermometer = new five.Thermometer({
  controller: "DS18B20",
  pin: 2,
  freq: 250
});
```

> More on the sensor [here](https://create.arduino.cc/projecthub/TheGadgetBoy/ds18b20-digital-temperature-sensor-and-arduino-9cc806).
