var connection;
var video;

document.addEventListener("DOMContentLoaded", () => {
	connection = document.getElementById("connection");
	video = document.getElementById("video");

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
	alert("Błąd połączenia");
	connection.classList.add("active");
}

function formValidateIP(event) {
	var regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^localhost$/;
	if (!this.validity.valueMissing) {
		if (regex.test(this.value)) {
			this.setCustomValidity("");
		}
		else {
			this.setCustomValidity("Podaj poprawny adres IP.");
		}
	}
	else {
		this.setCustomValidity("");
	}
}