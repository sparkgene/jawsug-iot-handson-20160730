var mraa = require('mraa');
var lcd = require('jsupm_i2clcd');

var interval = 2000;

var light_pin = new mraa.Aio(0);
var temp_pin = new mraa.Aio(1);
var sound_pin = new mraa.Aio(2);
var grove_lcd = new lcd.Jhd1313m1(6, 0x3E, 0x62);


setInterval(function() {

    var light_raw_val = light_pin.read();
    // calc light
    // https://github.com/intel-iot-devkit/upm/blob/master/src/grove/grove.cxx#L161-L168
    var lux_val = Math.round((10000.0 / Math.pow(((1023.0 - light_raw_val) * 10.0 / light_raw_val) * 15.0, 4.0 / 3.0) * 10)) / 10
    var temp_raw_val = temp_pin.read();
    // calc temperature
    // https://github.com/intel-iot-devkit/upm/blob/master/src/grove/grove.cxx#L128-L137
    celsius = ((1023.0 - temp_raw_val) * 10000.0) / temp_raw_val
    temp_val = Math.round((1.0 / ((Math.log(celsius / 10000.0) / 3975.0) + (1.0 / 298.15)) - 273.15) * 10) / 10
    var sound_raw_val = sound_pin.read();
    // Display sensed analog data on LCD
    grove_lcd.setColor(0,0,255);
    grove_lcd.setCursor(0,0);
    grove_lcd.write("Temp: " + temp_val);
    grove_lcd.setCursor(1,0);
    grove_lcd.write("Lux : " + lux_val);

}, interval);
