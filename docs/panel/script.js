var connection;
var container;
var snackbar;
var qualitySlider;
var resolutionSelect;

var adress;

document.addEventListener("DOMContentLoaded", () => {
	connection = document.getElementById("connection");
	container = document.getElementById("container");
	snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
	qualitySlider = new mdc.slider.MDCSlider(document.querySelector('#quality'));
	resolutionSelect = new mdc.select.MDCSelect(document.querySelector("#resolution").parentElement);

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

				snackbar.show({ message: "Connected" });
				setInterval(updateStatus, 5000);

				qualitySlider.value = response.curvals.quality;
				qualitySlider.listen('MDCSlider:change', () => {
					sendRequest("settings/quality?set=" + qualitySlider.value);
				});

				response.avail.video_size.forEach(resolution => {
					var optionElement = new Option(resolution, resolution);
					document.querySelector("#resolution").add(optionElement);
				});

				resolutionSelect.value = response.curvals.video_size;
				resolutionSelect.listen('change', () => {
					sendRequest("settings/video_size?set=" + resolutionSelect.value);
				});

				container.classList.add("active");
				qualitySlider.layout();
				resolutionSelect.layout();
			}
			else {
				console.warn("Connection error");
				connection.classList.add("active");

				snackbar.show({ message: "Connection error" });
			}
		}
	};

	httpRequest.timeout = 5000;
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
			}
			else {
				console.warn("Connection error");

				snackbar.show({ message: "Connection error" });
			}
		}
	};

	httpRequest.timeout = 2000;
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

				snackbar.show({ message: "Connection error" });
			}
		}
	};

	httpRequest.timeout = 2000;
	httpRequest.open('GET', adress + "/" + page, true);
	httpRequest.send();
}