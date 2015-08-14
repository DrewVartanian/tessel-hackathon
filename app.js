var ambient = require ('./ambient');
var camera = require('./camera');

var lightTriggerValue=0.1;
var soundTriggerValue=0.1;

ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    console.log("Taking Picture");

    // ambient.setSoundTrigger(soundTriggerValue);
 //    camera.takePicture(function(err, image) {
	//     if (err) {
	//       console.log('error taking image', err);
	//     } else {
	//       notificationLED.low();
	//       // Name the image
	//       var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
	//       // Save the image
	//       console.log('Picture saving as', name, '...');
	//       process.sendfile(name, image);
	//       console.log('done.');
	//       // Turn the camera off to end the script
	//       camera.disable();
	//     }
	// });

 //    // Clear it
 //    ambient.clearSoundTrigger();

 //    //After 1.5 seconds reset sound trigger
 //    setTimeout(function () {

 //        ambient.setSoundTrigger(soundTriggerValue);

 //    },1500);

  	ambient.setLightTrigger(lightTriggerValue);

    ambient.on('light-trigger', function(data) {
	    console.log("Our light trigger was hit:", data);
	    console.log("Taking Picture");
	    // notificationLED.high();

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
	    // Clear the trigger so it stops firing
	    ambient.clearLightTrigger();
	    //After 1.5 seconds reset light trigger
	    setTimeout(function () {

	        ambient.setLightTrigger(lightTriggerValue);

	    },1500);
  });

});