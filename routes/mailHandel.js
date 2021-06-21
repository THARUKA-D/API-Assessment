const express = require("express");
const sgMail = require("@sendgrid/mail");
const path = require("path");
const Mail = require("../models/mail");
const router = express.Router();
require("dotenv/config");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.use(express.static("public")); // giving access to the html page with its css file and js file

router.get("/", (req, res) => {
	// html page
	res.sendFile(path.resolve("public/homPage.html"));
});

router.get("/:id", async (req, res) => {
	//[GET]
	console.log("[GET] Incomming data from front-end, email id:", req.params.id); // mail id to get the email
	try {
		const object = await Mail.findById(req.params.id);
		const searchedMail = {
			id: object._id,
			status: object.status,
		};
		res.json(searchedMail); // response
		console.log("[GET] email response : ", searchedMail); //  response in console
	} catch (error) {
		res.json("[GET] email response : Email id is not valid");
	}
});

router.delete("/:id", async (req, res) => {
	//[DELETE]
	console.log(
		"[DELETE] Incomming data from front-end, email id:",
		req.params.id
	); // mail id to delete the email

	try {
		const object = await Mail.findByIdAndDelete(req.params.id);
		const searchedMail = {
			id: object._id,
			delete: object == null ? "Email Not Found" : "Successful",
		};
		res.send(searchedMail);
		console.log("[DELETE] email response : ", searchedMail);
	} catch (error) {
		const searchedMail = {
			id: object.id,
			delete: "Faild",
		};
		res.send(searchedMail);
		console.log("[DELETE] email response : Email id is not valid");
	}
});

let sendMailAt = 0;

function sendEmailAt() {
	/*
	 * Sydney, Australia is 4 hours and 30 minutes ahead of Sri Lanka
	 *
	 *local330Am  (3.30 Am in Sri lanka) = 8.00 Am in sydney
	 *local1230Pm (12.30 Pm in Sri lanka) = 5.00 Pm in sydney
	 *
	 */

	let currentTime = new Date();
	const UnixTimeFor1H = 3600000; // 3600000 mili seconds = 1 H

	let local330Am = new Date(
		currentTime.getFullYear(),
		currentTime.getMonth(),
		currentTime.getDate(),
		3,
		30,
		00,
		00
	);
	let local1230Pm = new Date(
		currentTime.getFullYear(),
		currentTime.getMonth(),
		currentTime.getDate(),
		12,
		30,
		00,
		00
	);
	let localNextDay12AM = UnixTimeFor1H * 11.5 + local1230Pm.valueOf();
	let localNextDay8AM = localNextDay12AM + UnixTimeFor1H * 8;

	if (
		local1230Pm.valueOf() > currentTime.valueOf() &&
		local330Am.valueOf() < currentTime.valueOf()
	) {
		sendMailAt = currentTime.valueOf();
		return true;
	} else if (
		local1230Pm.valueOf() < currentTime.valueOf() &&
		localNextDay12AM.valueOf() > currentTime.valueOf()
	) {
		sendMailAt = localNextDay8AM.valueOf();

		return false;
	} else {
		sendMailAt = local330Am.valueOf();
		return false;
	}
}

router.post("/", async (req, respose) => {
	console.log("[POST] Incomming data from front-end : ", req.body);

	sendEmailAt(); // getting the time to send the mail

	let sendMail;

	sendMail = {
		// object to send the mail
		to: req.body.to,
		from: {
			email: "tharukajn@gmail.com",
			name: "Tharuka Jayasooriya",
		},
		subject: req.body.subject,
		html: req.body.html,
		send_at: parseInt(sendMailAt / 1000),
	};

	// if local time  is in between 3.30AM - 12.30PM msg send
	sendEmailAt()
		? sendMailNow(sendMail, respose)
		: //if after 12.30pm msg queue .
		  sendMailNexdayMorning(sendMail, respose);

	//------------------------------------------------------ need to save the endpoint url in sendgrid to run the code as expected ---------------------------------------------------

	/*
	 * this part workd but after my free emails ended it stoped working as expexted and all the emails were added to queue in sendgrid
	 * I used ngrok(in local machine) so if i want to run this part as expected i have to save my new url in sendgrids webhook ........
	 *
	 * if using this part have to remove or comment out these 2 functions,
	 *  1) sendMailNow(sendMail,req,respose)
	 *  2) sendMailNexdayMorning(sendMail,respose)
	 *
	 * and have to comment above if statment,
	 *   *)  // if local time  is in between 3.30AM - 12.30PM msg send
	 *       sendEmailAt() ?
	 *       sendMailNow(sendMail,req,respose):
	 *
	 *       //if after 12.30pm msg que.
	 *       sendMailNexdayMorning(sendMail,respose);
	 *
	 */

	// try {  // sending the mail using sendgrid
	// 	await sgMail.send(sendMail).then((res) => {
	// 		if (res[0].statusCode == 202) {
	// 			// valid Email, queued or delivered.
	// 			console.log("Email status code", res[0].statusCode);
	// 		}
	// 	});
	// } catch (error) {
	// 	let saveMail = new Mail({
	// 		to: req.body.to,
	// 		subject: req.body.subject,
	// 		html: req.body.html,
	// 	});

	// 	saveMail  // saving the mail
	// 		.save()
	// 		.then((data) => {
	// 			let details = {
	// 				id: data._id,
	// 				status: data.status,
	// 			};
	// 			respose.json(details);
	// 		})
	// 		.catch((err) => {
	// 			console.log("Email status code : Failed!");
	// 		});
	// }

	//
	// var events = req.body;
	// console.log("EVENT body", events);
	// events.forEach(function (deliveryEvent) {    // catching the response from sendgrid webhook
	// 	// Here, you now have each event and can process them how you like
	// 	console.log("EVENT ", deliveryEvent.event);

	// 	processEvent(deliveryEvent);
	// 	let mailStatus;

	// 	if (deliveryEvent.event == "Processed") { // meaning is mail is queued
	//
	// 		mailStatus = "QUEUED";
	// 	}

	// 	if (deliveryEvent.event == "delivered") { // meaning is mail is sent
	//
	// 		mailStatus = "SENT";
	// 	}

	// 	// update the mongo db

	// 	let saveMail = new Mail({
	// 		_id: deliveryEvent.sg_message_id,
	// 		to: req.body.to,
	// 		subject: req.body.subject,
	// 		html: req.body.html,
	// 		send_at: `${sendMailAt / 1000}`,
	// 		status: deliveryEvent.event,
	// 	});

	// 	saveMail
	// 		.save()
	// 		.then((data) => {
	// 			let details = {
	// 				id: data._id,
	// 				status: data.status,
	// 			};
	// 			respose.json(details);
	// 		})
	// 		.catch((err) => {
	// 			respose.json({ message: err });
	// 		});
	// });

	//----------------------------------------------------------------------------------------------------------------------------------------------------
});

async function sendMailNow(sendMail, respose) {
	try {
		await sgMail.send(sendMail).then((res) => {
			// sending th mail using sendgrid
			if (res[0].statusCode == 202) {
				// 202 means email is recived to sendgrid and it has been queued  or sent

				let saveMail = new Mail({
					to: sendMail.to,
					subject: sendMail.subject,
					html: sendMail.html,
					send_at: parseInt(sendMailAt / 1000),
					status: "SENT",
				});

				console.log("Saving the mail");

				saveMail
					.save()
					.then((data) => {
						let details = {
							id: data._id,
							status: data.status,
						};
						respose.json(details);
						console.log("[POST] email response : ", details); // showing the result in console
					})
					.catch((err) => {
						respose.json({ message: err });
					});
			}
		});
	} catch (error) {
		console.log(error);
	}
}

async function sendMailNexdayMorning(sendMail, respose) {
	try {
		await sgMail.send(sendMail).then((res) => {
			if (res[0].statusCode == 202) {
				let saveMail = new Mail({
					to: sendMail.to,
					subject: sendMail.subject,
					html: sendMail.html,
					send_at: parseInt(sendMailAt / 1000),
					status: "QUEUED",
				});

				console.log("Saving the mail");

				saveMail
					.save()
					.then((data) => {
						let details = {
							id: data._id,
							status: data.status,
						};
						respose.json(details);
						console.log("[POST] email response : ", details); // showing the result in console
					})
					.catch((err) => {
						respose.json({ message: err });
					});
			}
		});
		// respose.json(sendMail);
	} catch (error) {
		console.log(error);
	}
}

module.exports = router;
