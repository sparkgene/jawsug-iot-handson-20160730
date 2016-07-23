var mraa = require('mraa');

var led_pin = new mraa.Gpio(2);
led_pin.dir(mraa.DIR_OUT);

var status = "on";
setInterval(function(){
  console.log(status);
  if( status === "on"){
    led_pin.write(1);
    status = "off";
  }
  else{
    led_pin.write(0);
    status = "on";
  }
}, 1000);
