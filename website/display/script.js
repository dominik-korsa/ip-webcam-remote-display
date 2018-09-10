var connection;
var video;

document.addEventListener("DOMContentLoaded", () => {
	connection = document.getElementById("connection");
	video = document.getElementById("video");

	connection.getElementsByClassName("ip")[0].addEventListener("input", formValidateIP);

	connection.addEventListener("submit", (e) => {
		e.preventDefault();
		connect();
	});

	connection.classList.add("active");
});

function connect() {
	connection.classList.remove("active");
	video.classList.add("active");
	var src = connection.getElementsByClassName("protocol")[0].value
		+ "://"
		+ connection.getElementsByClassName("ip")[0].value
		+ ":"
		+ connection.getElementsByClassName("port")[0].value
		+ "/video";
	console.log(src);
	video.src = src;
}

function formValidateIP(event) {
	var regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
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