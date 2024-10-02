$(document).ready(function() {
// Global variables
var aIO;
var audioContext;
var analyser;

function setMicInputButtons() {
	try {
		navigator.mediaDevices.enumerateDevices({audio:true, video:false}).then(function(devices){
			devices.forEach(function(device) {
				if(device.kind == "audioinput") {
					$("#menu2").append("<button id=button-" + device.deviceId + ">"+ device.label + "</button><br>");
					document.getElementById("button-" + device.deviceId).onclick = function() {
						console.log("Starting visualization with device " + device.label);
						startVisualize(device.deviceId);
					};
				}
		  });
		});
	} catch(e) {
		console.log(e);
	}
}

// https://stackoverflow.com/a/35997040
var toLog = function(value, min, max){
    var exp = (value-min) / (max-min);
  return min * Math.pow(max/min, exp);
}

function grabAudioStream() {
	navigator.mediaDevices.getUserMedia({audio: {deviceId: window.audioDeviceId}, video:false}).then(function(stream) {
		window.aStream = stream;
	});
}

function visualize() {
	// Setting up the audio analyser
	var source = audioContext.createMediaStreamSource(window.aStream);
	window.audioSource = source;
	source.connect(analyser);
	// Global analyser
	window.gAnalyser = analyser;

	// Set the Fast Fourier Transform size, which determines the size of our data, hence the number of bars
	analyser.fftSize = window.barCount;
	console.log(analyser.frequencyBinCount);

	function update() {
		canvas = document.getElementById("starCanvas");
		ctx = canvas.getContext("2d");

		// Generate the rainbow gradient
		gradient = ctx.createLinearGradient(0,0,1600,0);
		gradient.addColorStop(0, "#f00");
		gradient.addColorStop(0.2, "#ff0");
		gradient.addColorStop(0.4, "#0f5");
		gradient.addColorStop(0.6, "#00f");
		gradient.addColorStop(0.8, "#e1f");
		gradient.addColorStop(1, "#f0f");

		// Start reading the data from the specified range
		let dataStart = Math.round(analyser.frequencyBinCount * window.barMin);
		let dataEnd = Math.round(analyser.frequencyBinCount * window.barMax);

		let barHeightMultiplier = (window.barCount <= 32 ? -25 : -35);

		// Bar width depends on whether or not we're in star mode, which effectively doubles our bar count
		let barWidth = 1600  / (dataEnd - dataStart);
		if(window.starMode) barWidth /= 2;

		// Only relevant for star mode
		let barOffset = barWidth * dataStart;

		// Star image
		let starImg = document.getElementById("starImg");

		var draw = function() {
			// Make an array to hold our data and put the data in that array
			var array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);

			// Average out the high and low frequencies for the parallax BG
			crunchData(array);
			normalizeData();
			finalizeData();

			drawBG(array);

			// Call the background draw function in order to pass the analyser array

			// Reset the canvas and fill style
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = gradient;
			ctx.globalCompositeOperation = "lighter";
			ctx.globalAlpha = 1;

			for(let j=dataStart; j < dataEnd; ++j) {
				let value = array[j];
				let barHeight = window.barMult * (toLog(value, 1, 400) - 1);
				if(window.starMode) {
					ctx.fillRect(800 + (barWidth * j) - barOffset, canvas.height, (barWidth) * 0.98, barHeight);
					ctx.fillRect(800 - (barWidth * j) + barOffset - barWidth, canvas.height, (barWidth) * 0.98, barHeight);
				} else {
					ctx.fillRect((barWidth * j) - barOffset, canvas.height, barWidth * 0.98, barHeight);
				}
			}

			ctx.globalAlpha = 1;
			//ctx.drawImage(starImg, 0,0);
			ctx.globalAlpha = 1;

			ctx.globalCompositeOperation = "source-over";

			// Draws the star path
			/*ctx.beginPath();
			ctx.moveTo(0,700);
			ctx.lineTo(500,600);
			ctx.lineTo(800,0);
			ctx.lineTo(1100,600);
			ctx.lineTo(1600,700);
			ctx.lineWidth = 5;
			ctx.strokeStyle = "white";
			ctx.stroke();
*/
			// Draws the left eye
			/*ctx.beginPath();
			ctx.moveTo(600, 700);
			ctx.ellipse(650, 700, 50, 150, Math.PI, 0, Math.PI)

			// Draws the left eye
			ctx.moveTo(900, 700);
			ctx.ellipse(950, 700, 50, 150, Math.PI, 0, Math.PI)*/

			ctx.fillStyle = "black";
			ctx.fill();
			window.animationId = requestAnimationFrame(draw);

		}
		window.animationId = requestAnimationFrame(draw);
	};
	update();
};

function setMenuButton() {
	document.ondblclick = function() {
		$("#menu1").toggle();
		$("#menu2").toggle();
	};
}


startVisualize = function(deviceId) {
	analyser = audioContext.createAnalyser();
	window.barMax = document.getElementById("barMax").value;
	window.barMin = document.getElementById("barMin").value;
	window.barMult = -1 * parseInt(document.getElementById("barMult").value);
	window.starMode = document.getElementById("starMode").checked;
	window.barCount = 2 ** document.getElementById("barCount").value;
	window.audioDeviceId = deviceId;
	grabAudioStream();
	setMenuButton();
	setTimeout(() => visualize(), 300);
	$("#menu1").toggle(); 
	$("#menu2").toggle();
	//setTimeout(() => runBG1(), 1000);
	//setTimeout(() => runBG2(), 1000);
	//setTimeout(() => runBG3(), 1000);
	initBGData();
	initBG()
};

/* ------------------------------------------------ End Function Definitions ------------------------------------------------ */
audioContext = new AudioContext();
setMicInputButtons();
//setTimeout(() => initializeRandomElements(), 1);

document.getElementById("body").onclick = function() {
	audioContext.resume()
}

});