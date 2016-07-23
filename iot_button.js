var awsIot = require('aws-iot-device-sdk');
var mraa = require('mraa');
var lcd = require('jsupm_i2clcd');

var interval = 1000;

var device = awsIot.device({
   keyPath: "./certs/private.key",
  certPath: "./certs/cert.crt",
    caPath: "./certs/ca.pem",
  clientId: "iot-handson-edison",
    region: "ap-northeast-1"
});

var button_pin = new mraa.Aio(3);
var grove_lcd = new lcd.Jhd1313m1(6, 0x3E, 0x62);
var delay_count = 0;

device.on('connect', function() {
    console.log('connect');
    setInterval(function() {

        var button_val = button_pin.read();
        console.log(button_val);

	// Display sensed analog data on LCD
        grove_lcd.setColor(255,0,0);
        grove_lcd.setCursor(0,0);
        grove_lcd.write("button: " + button_val);

	if(button_val > 1000 && delay_count === 0){
            var now = new Date();
            var message = JSON.stringify({
                "serialNumber": "some_serial_no",
                "batteryVoltage": "5000mV",
                "clickType": "SINGLE"
            });
            device.publish('button', message);
            console.log("Publish: " + message);
	    delay_count = 2;
	}
	else{
	    if(delay_count > 0){
              delay_count--;
            }
	}
     }, interval);
});
