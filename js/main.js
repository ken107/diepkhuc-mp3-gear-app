
var audio = new Audio();

state = "SEARCH";
query = "";
pageToken = null;
items = null;
index = 0;
playing = false;

function search() {
	pageToken = null;
	items = null;
	loadMore(function(result) {
		pageToken = result.nextPageToken;
		items = result.items;
		index = 0;
		state = "LIST";
	})
}

function loadMore(callback) {
	ajaxPost("https://support.lsdsoftware.com:30299/diepkhuc-mp3?capabilities=search-1.0", {
		method: "search",
		query: query,
		maxResults: pageToken ? 25 : 5,
		pageToken: pageToken
	},
	callback)
}

function select() {
	var item = items[index];
	if (item.type == 1) audio.src = "http://dv.diepkhuc.com/mp3/" + item.id + ".mp3";
	else if (item.type == 2) audio.src = "https://support2.lsdsoftware.com/diepkhuc-mp3/download/" + item.id + "/file.m4a";

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
	if (up) {
		if (index > 0) index--;
	}
	else {
		index++;
		if (index >= items.length) {
			loadMore(function(result) {
				items.push.apply(items, result.items);
			})
		}
	}
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

function ajaxPost(url, data, fulfill) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    if (xhr.status == 200) fulfill(JSON.parse(xhr.responseText));
	    else console.error(xhr.responseText || xhr.statusText || xhr.status);
	  }
	};
	xhr.send(JSON.stringify(data));
}

function toggle(elem, visible) {
	elem.style.display = visible ? "" : "none";
}
