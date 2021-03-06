var connection, container, snackbar, qualitySlider, resolutionSelect, orientationSelect, flashlight, camera, overlay, focus;

var adress;

document.addEventListener("DOMContentLoaded", () => {
	connection = document.getElementById("connection");
	container = document.getElementById("container");
	snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
	qualitySlider = new mdc.slider.MDCSlider(document.querySelector('#quality'));
	resolutionSelect = new mdc.select.MDCSelect(document.querySelector("#resolutionWrapper"));
	orientationSelect = new mdc.select.MDCSelect(document.querySelector("#orientationWrapper"));
	flashlight = new mdc.iconButton.MDCIconButtonToggle(document.querySelector("#flashlight"));
	camera = new mdc.iconButton.MDCIconButtonToggle(document.querySelector("#camera"));
	overlay = new mdc.iconButton.MDCIconButtonToggle(document.querySelector("#overlay"));
	focus = new mdc.iconButton.MDCIconButtonToggle(document.querySelector("#focus"));

	window.mdc.autoInit();

	document.getElementById("ip").addEventListener("input", formValidateIP);

	connection.addEventListener("submit", (e) => {
		e.preventDefault();
		formSubmit();
	});

	connection.classList.add("active");
});

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

function formSubmit() {
	connection.classList.remove("active");
	var src = document.getElementById("protocol").value
		+ "://"
		+ document.getElementById("ip").value
		+ ":"
		+ document.getElementById("port").value;
	console.log(src);
	adress = src;
	connect();
}

function connect() {
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			if (httpRequest.status == 200) {
				var response = JSON.parse(httpRequest.responseText);
				console.log(response);

				snackbar.labelText = 'Connected';
				snackbar.open();
				setInterval(updateStatus, 5000);

				qualitySlider.value = response.curvals.quality;
				qualitySlider.listen('MDCSlider:change', () => {
					sendRequest("settings/quality?set=" + qualitySlider.value);
				});

				var resolutions = response.avail.video_size.sort((a, b) => {
					aVert = a.split("x")[1];
					bVert = b.split("x")[1];
					return bVert - aVert;
				});
				resolutions.forEach(resolution => {
					var text = resolution.split("x")[0] + " x " + resolution.split("x")[1];
					var optionElement = new Option(text, resolution);
					document.querySelector("#resolution").add(optionElement);
				});

				resolutionSelect.value = response.curvals.video_size;
				resolutionSelect.listen('change', () => {
					sendRequest("settings/video_size?set=" + resolutionSelect.value);
				});

				orientationSelect.value = response.curvals.orientation;
				orientationSelect.listen('change', () => {
					sendRequest("settings/orientation?set=" + orientationSelect.value);
				});

				flashlight.on = response.curvals.flashmode == "torch";
				flashlight.listen("MDCIconButtonToggle:change", () => {
					sendRequest(flashlight.on ? "enabletorch" : "disabletorch");
				});

				camera.on = response.curvals.ffc == "on";
				camera.listen("MDCIconButtonToggle:change", () => {
					sendRequest("settings/ffc?set=" + (camera.on ? "on" : "off"));
				});

				overlay.on = response.curvals.overlay == "on";
				overlay.listen("MDCIconButtonToggle:change", () => {
					sendRequest("settings/overlay?set=" + (overlay.on ? "on" : "off"));
				})

				focus.on = response.curvals.focus == "on";
				focus.listen("MDCIconButtonToggle:change", () => {
					sendRequest(focus.on ? "focus" : "nofocus");
				})

				container.classList.add("active");
				qualitySlider.layout();
				resolutionSelect.layout();
				orientationSelect.layout();
			}
			else {
				console.warn("Connection error");
				connection.classList.add("active");

				snackbar.labelText = 'Connection error';
				snackbar.open();
			}
		}
	};

	httpRequest.open('GET', adress + "/status.json?show_avail=1", true);
	httpRequest.send();
}

function updateStatus() {
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			if (httpRequest.status == 200) {
				var response = JSON.parse(httpRequest.responseText);
				console.log(response);

				if (response.curvals.quality) qualitySlider.value = response.curvals.quality;
				if (response.curvals.video_size) resolutionSelect.value = response.curvals.video_size;
				if (response.curvals.orientation) orientationSelect.value = response.curvals.orientation;
				if (response.curvals.flashmode) flashlight.on = response.curvals.flashmode == "torch";
				if (response.curvals.ffc) camera.on = response.curvals.ffc == "on";
				if (response.curvals.overlay) overlay.on = response.curvals.overlay == "on";
				if (response.curvals.focus) focus.on = response.curvals.focus == "on";
			}
			else {
				console.warn("Connection error");

				snackbar.labelText = 'Connection error';
				snackbar.open();
			}
		}
	};

	httpRequest.open('GET', adress + "/status.json", true);
	httpRequest.send();
}

function sendRequest(page) {
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			if (httpRequest.status == 200) {
				updateStatus();
			}
			else {
				console.warn("Connection error");

				snackbar.labelText = 'Connection error';
				snackbar.open();
			}
		}
	};

	httpRequest.open('GET', adress + "/" + page, true);
	httpRequest.send();
}
