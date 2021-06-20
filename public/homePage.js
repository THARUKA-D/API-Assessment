const emailForm = document.querySelector(".emilForm");
let sendEmailTo = document.getElementById("emailTo");
let emailSubject = document.getElementById("subject");
let formhtml = document.getElementById("emailBody");
//let email = emailTo.value;

emailForm.addEventListener("submit", (e) => {
	e.preventDefault();

	let formData = {
		to: sendEmailTo.value,
		subject: emailSubject.value,
		html: "<h1>" + formhtml.value + "</h1>",
	};
	console.log(formData);

	//xml http req
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/v1/emails"); // sending data to endpoint
	xhr.setRequestHeader("content-type", "application/json");
	xhr.onload = () => {
		//  console.log(xhr.responseText);
		console.log("Email data sent to backend");
		sendEmailTo.value = "";
		emailSubject.value = "";
		formhtml.value = "";
	};

	xhr.send(JSON.stringify(formData));

	alert("Email Data successfully delivered to backend.");
});

const getEmailForm = document.querySelector(".getEmailForm");
let getEmialId = document.getElementById("emailIdGet");

getEmailForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const idGet = {
		id: getEmialId.value,
	};

	//xml http req
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `/v1/emails/${getEmialId.value}`); // sending data to endpoint
	xhr.setRequestHeader("content-type", "application/json");
	xhr.onload = () => {
		//  console.log(xhr.responseText);
		console.log(`Get Email id : ${getEmialId.value} succeeded.`);
		getEmialId.value = "";
	};
	xhr.send(JSON.stringify(idGet));

	alert(
		"Email Data successfully delivered to backend to get status of the email."
	);
});

const deleteEmailForm = document.querySelector(".deleteEmailForm");
let deleteEmialId = document.getElementById("emailIdDelete");

deleteEmailForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const idDelete = {
		id: deleteEmialId.value,
	};

	//xml http req
	let xhr = new XMLHttpRequest();
	xhr.open("DELETE", `/v1/emails/${deleteEmialId.value}`); // sending data to endpoint
	xhr.setRequestHeader("content-type", "application/json");
	xhr.onload = () => {
		//  console.log(xhr.responseText);
		console.log(`Deleteing : Email id ${deleteEmialId.value} succeeded.`);
		deleteEmialId.value = "";
	};
	xhr.send(JSON.stringify(idDelete));
	alert("Email Data successfully delivered to backend to delete the email.");
});
