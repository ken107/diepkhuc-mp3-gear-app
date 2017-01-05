
window.onload = function () {
    // TODO:: Do your initialization job
	var audio = new Audio();

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	var box = document.querySelector('#textbox');
    	box.innerHTML = (box.innerHTML === "Basic") ? "Sample" : "Basic";

    	audio.src = "http://dv.diepkhuc.com/mp3/27254.mp3";
    	audio.load();
    	audio.play();
    });

};
