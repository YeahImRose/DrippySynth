var layerCount = 4;
var normSamples = 10;
window.rawData = [];
window.normalizedData = [];
window.dataOutput = [];
var debug1 = 0;

function initNormData() {
	for(let i = 0; i < layerCount; ++i) window.normalizedData[i] = [];
}

function crunchData(data) {
	for(let splice = 0; splice < layerCount; ++splice) {
		let dataStart = (data.length / layerCount) * splice;
		for(let i = dataStart; i < dataStart + (data.length / layerCount); ++i) {
			window.rawData[splice] += i;
		}
		window.rawData[splice] /= layerCount;
	}
}

function avgData() {
	for(let i = 0; i < layerCount; ++i) {
		window.normalizedData[i].push(window.rawData[i]);
		if(window.normalizedData[i].length >= normSamples) window.normalizedData[i].shift();
	}
}

function finalizeData() {
	for(let i = 0; i < layerCount; ++i) window.dataOutput[i] = window.normalizedData[i] / normSamples;
}

function step(now, tween) {
	let val = 0;
	let id = tween.elem.clientTop;
	window.bgData2.forEach(i => val += i);
	if(tween.prop == "left") 
		if(window.bgData2) {
			cum2 += (30 * (val / 2550))
			tween.now = cum2;
		}
	if(cum2 >= 0) cum2 -= 1920;
	
}