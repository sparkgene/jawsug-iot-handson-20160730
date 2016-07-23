var awsIot = require('aws-iot-device-sdk');
var mraa = require('mraa');

var shadowName = "iot-handson-edison"
var thingShadows = awsIot.thingShadow({
   keyPath: "./certs/private.key",
  certPath: "./certs/cert.crt",
    caPath: "./certs/ca.pem",
  clientId: "iot-handson-edison",
    region: "ap-northeast-1"
});

var clientTokenGet, clientTokenUpdate, alarmStatus="0";
var checkStatus = function(status){
  console.log("alarmStatus:" + alarmStatus);
  console.log("status:" + status);
  if(status == "0"){
    // led off
    led_pin.write(0);
  }
  else{
    // led on
    led_pin.write(1);
  }
  alarmStatus=status;
  console.log("update to:" + alarmStatus);
  // update my status
  clientTokenUpdate = thingShadows.update(shadowName, {"state":{"reported": {"alarm": alarmStatus}}});
}

var led_pin = new mraa.Gpio(2);
led_pin.dir(mraa.DIR_OUT);

thingShadows.on('connect', function() {
    console.log('connected');
    thingShadows.register( shadowName );
    console.log('registered');
    setTimeout( function() {
       clientTokenGet = thingShadows.get(shadowName);
    }, 1000 );
});

thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
    console.log('received ' + stat + ' on ' + thingName + ': ' + JSON.stringify(stateObject));
    if( stat == "accepted" ){
      if( clientTokenGet == clientToken ){
        // result of get event
        checkStatus(stateObject.state.desired.alarm);
      }
      else if( clientTokenUpdate == clientToken){
        // result of update event
        console.log("update accepted");
      }
    }
});

thingShadows.on('delta', function(thingName, stateObject) {
    console.log('received delta on ' + thingName + ': ' + JSON.stringify(stateObject));
    checkStatus(stateObject.state.alarm);
});

thingShadows.on('timeout', function(thingName, clientToken) {
     console.log('received timeout on ' + operation + ': ' + clientToken);
});

process.on('SIGINT', function() {
  // led off before exit
  led_pin.write(0);
  process.exit();
});
