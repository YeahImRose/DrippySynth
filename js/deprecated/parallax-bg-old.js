/*
var stepAnimate = function _step(now, tween) {
//	if(debug1 <10) console.log(tween);
//	debug1++;
	let id = parseInt(tween.elem.id.substring(10)) - 1;
	if(tween.prop == "left") 
		if(dataOutput[id]) {
			cumulativeVal[id] += (((id+1) * 10) * (dataOutput[id] / 2550))
			tween.now = cumulativeVal[id];
		}
	if(cumulativeVal[id] >= 0) cumulativeVal[id] -= 1920;
	
}

var onComplete1 = function complete1() {
	$("#parallaxBg1").offset({ top:0, left:-1920});
	runBG1();
}

var onComplete2 = function complete2() {
	$("#parallaxBg2").offset({ top:0, left:-1920});
	runBG2();
}

var onComplete3 = function complete3() {
	$("#parallaxBg3").offset({ top:0, left:-1920});
	runBG2();
}

function runBG1() {
	$("#parallaxBg1").animate({top:0, left:0}, {
		duration:10000000,
		easing:"linear",
		step:stepAnimate,
		complete:onComplete1
	})
}

function runBG2() {
	$("#parallaxBg2").animate({top:0, left:0}, {
		duration:10000000,
		easing:"linear",
		step:stepAnimate,
		complete:onComplete2
	})
}

function runBG3() {
	$("#parallaxBg3").animate({top:0, left:0}, {
		duration:10000000,
		easing:"linear",
		step:stepAnimate,
		complete:onComplete3
	})
}
*/