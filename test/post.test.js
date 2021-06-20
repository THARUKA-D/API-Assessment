const supertest = require("supertest");
const assert = require("assert");
const Mail = require("../models/mail");
const app = require("../app"); //reference to you app.js file

// i dont know how to run these seperatly but when i use postman an

describe("POST /v1/emails", function () {
	let maleInfo = {
		to: "tharukajn@gmail.com",
		from: {
			email: "tharukajn@gmail.com",
			name: "Tharuka Jayasooriya",
		},
		subject: "subject",
		html: "Email body",
		send_at: 1624242600,
	};

	it("This shoud return status code 200 after email is sent and saved in mongo db", function (done) {
		supertest(app)
			.post("/v1/emails")
			.send(maleInfo)
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) done(err);
				done();
			});
	});
});

describe("GET /v1/emails/:id", function () {
	it("Retrun the value of one email send status and id", function (done) {
		supertest(app)
			.get("/v1/emails/60cf5d059c3c1908a8d8e833")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) done(err);
				done();
			});
	});
});

describe("DELETE /v1/emails/:id", function () {
	it("Retrun the value of one deleted emails status and id", function (done) {
		supertest(app)
			.delete("/v1/emails/60cf6491ebc78b5a8c9f1ed4")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) done(err);
				done();
			});
	});
});

// 60cc460fdf0c5e1568c4b020
// 60cc4631df0c5e1568c4b022
// 60cfadf049ddbe1318b7fa6e
// 60cfae3174ca53125cfdcc70
