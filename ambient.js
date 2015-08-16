// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var http = require('http');
// var express = require('express');
var server = http.createServer();

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var camera = require('camera-vc0706').use(tessel.port['A']);
var relaylib = require('relay-mono');
var servolib = require('servo-pca9685');

var ambient = ambientlib.use(tessel.port['C']);
var relay = relaylib.use(tessel.port['B']);
var servo = servolib.use(tessel.port['D']);

var servo1 = 1; // We have a servo plugged in at position 1

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

var lightTriggerValue=0.1;
var soundTriggerValue=0.1;


server.on('request',function(request,response){
  console.log("get!!!!")

  relay.turnOn(1, function toggleOneResult(err) {
    if (err) console.log("Err toggling 1", err);
  });

  setTimeout(function(){
    ambient.setSoundTrigger(soundTriggerValue);
    servo.move(servo1, 1);
    setTimeout(function(){
      servo.move(servo1, 0);
    },4000);
  },4000);

  response.end();
})

server.listen(3001, function () {
 console.log('Server on.');
});

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, ldata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        // console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
    });
  })}, 500); // The readings will happen every .5 seconds unless the trigger is hit

  // Set a light level trigger
  // The trigger is a float between 0 and 1

//   // Set a sound level trigger
//   // The trigger is a float between 0 and 1
//   

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    console.log("Taking Picture");

    notificationLED.high();
    // Take the picture
    camera.takePicture(function(err, image) {
      if (err) {
        console.log('error taking image', err);
      } else {
        notificationLED.low();
        // Name the image
        var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
        // Save the image
        console.log('Picture saving as', name, '...');
        process.sendfile(name, image);
        console.log('done.');
        // Turn the camera off to end the script
        camera.disable();
      }

      // var request = http.request({
      //     hostname: '192.168.2.30', // Where your other process is running
      //     port: 3000,
      //     path: __dirname + name,
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'image/jpg',
      //         'Content-Length': imageBuffer.length,
      //         'Access-Control-Allow-Origin': '*'
      //     }
      // });

      // request.write(imageBuffer);
    });

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(soundTriggerValue);

    },1500);

  });
});

ambient.on('error', function (err) {
  console.log(err)
});


function takePicture(){
  camera.on('ready', function() {
    notificationLED.high();
    // Take the picture
    camera.takePicture(function(err, image) {
      if (err) {
        console.log('error taking image', err);
      } else {
        notificationLED.low();
        // Name the image
        var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
        // Save the image
        console.log('Picture saving as', name, '...');
        process.sendfile(name, image);
        console.log('done.');
        // Turn the camera off to end the script
        camera.disable();
      }
    });
  });
}

  relay.on('ready', function relayReady () {
    console.log('Ready! Toggling relays...');
      // Toggle relay channel 1
      
      // Toggle relay channel 2
      // relay.toggle(2, function toggleTwoResult(err) {
      //   if (err) console.log("Err toggling 2", err);
      // });
  });

  // When a relay channel is set, it emits the 'latch' event
  relay.on('latch', function(channel, value) {
    console.log('latch on relay channel ' + channel + ' switched to', value);
  });


  servo.on('ready', function () {
    var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

    //  Set the minimum and maximum duty cycle for servo 1.
    //  If the servo doesn't move to its full extent or stalls out
    //  and gets hot, try tuning these values (0.05 and 0.12).
    //  Moving them towards each other = less movement range
    //  Moving them apart = more range, more likely to stall and burn out
    servo.configure(servo1, 0.05, 0.12, function () {
      // servo.move(servo1, 1);
      // setInterval(function () {
      //   console.log('Position (in range 0-1):', position);
      //   //  Set servo #1 to position pos.
      //   servo.move(servo1, position);

      //   // Increment by 10% (~18 deg for a normal servo)
      //   position += 1;
      //   if (position > 1) {
      //     position = 0; // Reset servo position
      //   }
      // }, 1000); // Every 500 milliseconds
    });
  });