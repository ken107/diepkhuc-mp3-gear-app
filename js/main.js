
var audio = new Audio();

state = "SEARCH";
query = "";
items = null;
index = 0;
playing = false;

function search() {
	items = null;
	ajaxGet("http://app.diepkhuc.com:30112/diepkhuc-mp3/search?limit=50&orderBy=lastPlayed%20DESC&query=" + encodeURIComponent(query), function(result) {
		items = result.items;
		index = 0;
		state = "LIST";
	})
}

function select() {
	audio.src = "http://dv.diepkhuc.com/mp3/" + items[index].id + ".mp3";
	audio.load();
	audio.play();
	playing = true;
	state = "VIEW";
}

function togglePlayPause() {
	if (playing) {
		audio.pause();
		playing = false;
	}
	else {
		audio.play();
		playing = true;
	}
}

function scroll(up) {
	if (up) index--;
	else index++;
	index = (index + items.length) % items.length;
}

function goBack() {
	switch (state) {
		case "VIEW": state = "LIST"; break;
		case "LIST": state = "SEARCH"; break;
		default: tizen.application.getCurrentApplication().exit();
	}
}

window.onload = function() {
	document.addEventListener("tizenhwkey", function(e) {
		if (e.keyName == "back") goBack();
	});
	document.addEventListener("rotarydetent", function(e) {
		scroll(e.detail.direction == 'CCW');
	});
}

function ajaxGet(url, callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) callback(JSON.parse(httpRequest.responseText));
		}
	};
	httpRequest.open('GET', url);
	httpRequest.send();
}

function toggle(elem, visible) {
	elem.style.display = visible ? "" : "none";
}
