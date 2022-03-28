var width = 800
var height = 600;
var winposx = window.outerWidth/2;
var winposy = window.outerHeight/2;

var canvas = [
	document.getElementById('layer1'),
	document.getElementById('layer2'),
	document.getElementById('layer3')
];

function newImage() {
	// Get the time
	var date = new Date(Date.now());

	// Get some useful variables from that.
	
	// Scaling values
	var milliScale = (date.getMilliseconds()/1000);
	var milliScalex2 = (1 + date.getSeconds() % 2)*milliScale;
	var secScale = date.getSeconds()+(date.getMilliseconds()/1000);
	var secScalex2 = (1 + date.getMinutes() % 2)*secScale;
	var minScale = date.getMinutes()+(date.getSeconds()/60)+(date.getMilliseconds()/1000);
	var minScalex2 = (1 + date.getHours() % 2)*minScale;
	var hourScale = date.getHours()+(date.getMinutes()/60)+(date.getSeconds()/60)+(date.getMilliseconds()/1000);
	var hourScalex2 = (1 + date.getDay() % 2)*hourScale;
	var dayScale = date.getDay()+(date.getHours()/24)+(date.getMinutes()/60)+(date.getSeconds()/60)+(date.getMilliseconds()/1000);
	var dayScalex2 = (1 + date.getMonth() % 2)*dayScale;
	var yearScale = date.getDay()+(date.getHours()/24)+(date.getMinutes()/60)+(date.getSeconds()/60)+(date.getMilliseconds()/1000);

	// Value that grows higher and lower based on the time of day.
	var daylight = -2*Math.pow(date.getUTCHours()-12, 2)+255;

	// Levels of angles to use: seconds, seconds but inverse, minutes, minutes inverse, hours, hours inverse.
	var angle1 = -0.07*Math.pow(minScalex2,2)+daylight;
	var angle2 = -1*angle1
	var angle3 = -0.07*Math.pow(hourScalex2,2)+daylight;
	var angle4 = -1*angle3
	var angle5 = -0.07*Math.pow(dayScalex2,2)+daylight;
	var angle6 = -1*angle5

	// Arbitrary colors for the gradients that change depending on the above angles
	var red1 = daylight*Math.cos(angle1);
	var green1 = (daylight*Math.cos(angle3))+(daylight*Math.sin(angle3));
	var blue1 = daylight*Math.sin(angle1);
	var red2 = daylight*Math.sin(angle2);
	var green2 = (daylight*Math.sin(angle4))+(daylight*Math.cos(angle4));
	var blue2 = daylight*Math.cos(angle2);

	// Moving the second gradient
	// We move to the left or to the right based on whether the current second is even or odd.
	dir = -1;
	if(date.getSeconds() % 2 == 0) dir = 1;
	var posx = (-0.005*Math.pow(secScalex2-height,2)*milliScalex2)+((width/hourScale)*dir);
	var posy = height/minScale;

	// Get the layers
	var ctx = [
		canvas[0].getContext("2d"),
		canvas[1].getContext("2d"),
		canvas[2].getContext("2d")
	];

	// Create gradients on the first two layers
	var gradient = [
		ctx[0].createLinearGradient(0,0,(width/2)+Math.cos(angle1)*10,(height/2)+Math.sin(angle1)*10),
		ctx[1].createRadialGradient(posx,posy,0,width*2+secScale,(height/2)+Math.sin(angle1)*10,width)
	];

	gradient[0].addColorStop(0, "rgb("+red1+","+green1+","+blue1+")");
	gradient[0].addColorStop(1, "rgb("+red2+","+green2+","+blue2+")");
	gradient[1].addColorStop(0, "rgb("+daylight+","+daylight+",0)");
	gradient[1].addColorStop(1, "rgb(0,0,"+daylight+")");
	ctx[0].fillStyle = gradient[0];
	ctx[1].fillStyle = gradient[1];
	ctx[0].fillRect(0,0,width,height);
	ctx[1].fillRect(0,0,width,height);

	// Get the data from those layers.

	var data = [
		ctx[0].getImageData(0,0,width,height),
		ctx[1].getImageData(0,0,width,height),
		ctx[2].getImageData(0,0,width,height)
	];

	// On the third layer, combine those two via xoring.
	for(var y = 0; y < height*4; y++) { // For each row
		for(var x = 0; x < width; x+=4) { // And each column
			// Set the corresponding pixel to a xor'd output of two images
			var pixel = x+y*width;
			data[2].data[pixel] = data[0].data[pixel] ^ data[1].data[pixel];
			data[2].data[pixel+1] = data[0].data[pixel+1] ^ data[1].data[pixel+1];
			data[2].data[pixel+2] = data[0].data[pixel+2] ^ data[1].data[pixel+2];
			data[2].data[pixel+3] = 255;
		}
	}
	ctx[2].putImageData(data[2],0,0);
	requestAnimationFrame(newImage);
}

function resize() {
	canvas[0].width = width; canvas[1].width = width; canvas[2].width = width;
	canvas[0].height = height; canvas[1].height = height; canvas[2].height = height; 
}

window.addEventListener('resize',resize);

// event listener for browsers that don't automatically execute code.
window.addEventListener('load', function() {
	resize();
	newImage();
})
