var twinkleStarCount = 50;
var MOVE_OPTIONS = 	{
	duration: 45000,
	easing: "swing",
	queue: false
}

function random(max) {
	return Math.round(Math.random() * max);
}

function initStarPositions() {
	for(let i = 1; i < twinkleStarCount; ++i) {
		var $star = $("#twinkleStar0").clone();
		$star[0].id = "twinkleStar" + i;
		let size = random(4)
		$star.css({
			top: random(1080),
			left: random(1920),
			width: 7 + size,
			height: 7 + size
		});
		$star[0].src = "assets/starTwinkle" + random(6) + ".png";
		$("#effects").append($star);
	}
}

function starMoveEffectTask() {
	let starNum = random(twinkleStarCount);
	$("#twinkleStar" + starNum).animate({left: (random(2320) - 200), top:(random(1480) - 200)}, MOVE_OPTIONS);
	return setTimeout(() => starMoveEffectTask(), 70);
}

function effectTwinklingStarsTask() {
	let starNum = random(twinkleStarCount);

	$("#twinkleStar" + starNum)
	.fadeOut(500 + random(3000))
	.delay(1000 + random(2000))
	.fadeTo(500 + random(3000), 0.6);

	// We call this function again after a random amount of time between 100 and 300 ms from now
	return setTimeout(() => effectTwinklingStarsTask(), 100 + random(200));
}

function effectStarShine() {
	let starNum = random(twinkleStarCount);
	let size = $("#twinkleStar" + starNum).css("width");
	let resized = Math.floor(size * 1.5);
	$("#twinkleStar" + starNum)
	.animate({width: resized, height: resized, opacity: 0.8});
	// We call this function again after a random amount of time between 30 sec and 2 min from now
	return setTimeout(() => effectStarShine(), random(9000) + 3000);
}

function initializeRandomElements() {
	return;
	initStarPositions();
	effectTwinklingStarsTask();
	starMoveEffectTask();
}