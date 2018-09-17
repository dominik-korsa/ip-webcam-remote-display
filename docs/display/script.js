var connection;
var video;
var fullscreen;

document.addEventListener("DOMContentLoaded", () => {
	connection = document.getElementById("connection");
	video = document.getElementById("video");
	fullscreen = document.getElementById("fullscreen");

	window.mdc.autoInit();

	document.getElementById("ip").addEventListener("input", formValidateIP);

	connection.addEventListener("submit", (e) => {
		e.preventDefault();
		connect();
	});

	video.addEventListener("error", connectError);

	connection.classList.add("active");
});

function connect() {
	connection.classList.remove("active");
	video.classList.add("active");
	var src = document.getElementById("protocol").value
		+ "://"
		+ document.getElementById("ip").value
		+ ":"
		+ document.getElementById("port").value
		+ "/video";
	console.log(src);
	video.src = src;
}

function connectError(error) {
	console.warn("Connection error", error);
	video.classList.remove("active");
	alert("Connection error");
	connection.classList.add("active");
}

function formValidateIP(event) {
	var regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^localhost$/;
	if (!this.validity.valueMissing) {
		if (regex.test(this.value)) {
			this.setCustomValidity("");
		}
		else {
			this.setCustomValidity("Enter correct IP adress.");
		}
	}
	else {
		this.setCustomValidity("");
	}
}

function goBigOrGoHome() {
	var docElm = document.documentElement;

	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	}
	else if (docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	}
	else if (docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
	else if (docElm.msRequestFullscreen) {
		docElm.msRequestFullscreen();
	}
}

document.addEventListener("fullscreenchange", function () {
	if (document.fullscreen) {
		fullscreen.classList.remove("active");
	}
	else {
		fullscreen.classList.add("active");
	}
}, false);

document.addEventListener("mozfullscreenchange", function () {
	if (document.mozFullScreen) {
		fullscreen.classList.remove("active");
	}
	else {
		fullscreen.classList.add("active");
	}
}, false);

document.addEventListener("webkitfullscreenchange", function () {
	if (document.webkitIsFullScreen) {
		fullscreen.classList.remove("active");
	}
	else {
		fullscreen.classList.add("active");
	}
}, false);

document.addEventListener("msfullscreenchange", function () {
	if (document.msFullscreenElement) {
		fullscreen.classList.remove("active");
	}
	else {
		fullscreen.classList.add("active");
	}
}, false);