var shimmerChance = 0.005
var shimmerTimer = 0;

var layerCount = 3;
var normSamples = 200;
var rawData = [0,0,0];
var normalizedData = [];
var dataOutput = [];
var cumulativeVal = [];
var activeShimmers = [];

var paused = false;

let bgCanvas;
let bgCtx;
let shimmers;
let bgs;
var animatedShimmers = {};

/*function loadAnimatedShimmers() {
	animatedShimmers.chomp = [];
	for(let i = 0; i < 44; ++i) {
		let img = new Image();
		img.src = 'assets/chomp/Chomp Shimmer (' + i + ').png'
		animatedShimmers.chomp.push(img)
	}
}*/

function pause() {
	paused = !paused;
}

function initBGData() {
	for(let i = 0; i < layerCount; ++i) normalizedData[i] = [];
	for(let i = 0; i < layerCount; ++i) cumulativeVal[i] = 0;
}

function crunchData(data) {
	for(let splice = 0; splice < layerCount; ++splice) {
		let dataStart = Math.round((data.length / layerCount) * splice);
		for(let i = dataStart; i < Math.round(dataStart + (data.length / layerCount)); ++i) {
			rawData[splice] += data[i];
		}
		rawData[splice] /= (data.length / layerCount);
	}
}

function normalizeData() {
	for(let i = 0; i < layerCount; ++i) {
		normalizedData[i].push(rawData[i]);
		if(normalizedData[i].length >= normSamples) normalizedData[i].shift();
	}
}

function finalizeData() {
	for(let i = 0; i < layerCount; ++i) dataOutput[i] = normalizedData[i].reduce((a,b) => a + b) / normSamples;
}


function initBG() {
	// Grabbing the canvas and 2d context
	//bgCanvas = document.getElementById("bgCanvas");
	//bgCtx = bgCanvas.getContext("2d");

	// Adding shimmer images to an array
	//shimmers = document.getElementsByClassName("shimmer");

	// Adding starry bgs to an array
	//bgs = [document.getElementById("parallaxBg1"),document.getElementById("parallaxBg2"),document.getElementById("parallaxBg3")];
}

function spawnNewShimmer() {
	let newShimmer = {
		"pos_x": -200,
		"pos_y": -100 + Math.round(Math.random() * 900),
		"distance": 25 + Math.round(Math.random() * 75),
		"img": shimmers[Math.round(Math.random() * (shimmers.length - 1))]
	}
	activeShimmers.push(newShimmer);
	shimmerTimer = 180;
}

function drawBG(data) {
	if(paused) return;
	// Reset the canvas and fill style
	//bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

	// Chance to spawn new shimmer every frame, assuming we haven't made one in the last half second
	//if(shimmerTimer <= 0 && Math.random() < shimmerChance) {
		// Ensure overall audio is above 5%
		//let total = 0;
		//for(let i = normalizedData.length; i >= 0; --i) total += normalizedData[i];
		//if(dataOutput[0] >= 255.0 * 0.05) spawnNewShimmer();
	//}
	--shimmerTimer;

	let to_remove = [];
	for(let i = 0; i < activeShimmers.length; ++i) {
		// Trial and error number crunching to get a good speed-to-distance ratio
		//let dataSliceValue = ((activeShimmers[i]["distance"] - 25) / 25) - 1;
		activeShimmers[i]["pos_x"] += (dataOutput[0] / (4 * activeShimmers[i]["distance"])); /// (activeShimmers[i]["distance"]);
		// Drawing the shimmer with relative size
		bgCtx.drawImage(activeShimmers[i]["img"],
						activeShimmers[i]["pos_x"],
						activeShimmers[i]["pos_y"],
						175 - activeShimmers[i]["distance"],
						175 - activeShimmers[i]["distance"]);
		// If the shimmer has gone off-screen, we add it to an array to remove (if we did it now, I suspect it'd cause some looping errors)
		if(activeShimmers[i]["pos_x"] > 2100) to_remove.push(activeShimmers[i]);
	}

	// Removing any of the shimmers that have reached their end and letting GC deal with them
	for (var i = 0; i < to_remove.length; ++i) {
		activeShimmers.splice(activeShimmers.indexOf(to_remove[i]), 1);
	}

	// Rendering the star layers (we do this last so it draws over the shimmers)
	for(let layer = 0; layer < layerCount; ++layer) {
		if(layer < 3) {
			if(dataOutput[layer]) {
				cumulativeVal[layer] += (((layer + 1) * 10) * (dataOutput[layer] / 2550));
			}
			if(cumulativeVal[layer] >= 0) cumulativeVal[layer] -= 1920;

			//bgCtx.drawImage(bgs[layer], cumulativeVal[layer], 0);
		}
	}
}
