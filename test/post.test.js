const supertest = require("supertest");
const assert = require('assert');
const Mail = require('../models/mail')
const app = require('../app'); //reference to you app.js file
 

// i dont know how to run these seperatly but when i use postman an 


describe("POST /", function(){
    it("This shoud return status code 200 after email is sent and saved in mongo db", function(done) {
      supertest(app)
        .post("/")
        .send( Mail( {
            to: "test@mail.com",
            subject: "mail subject",
            html: "html body with the email",
            send_at: 1234568977 , //unix time returns an int
            status: "Status"
        }))
        .expect(200)
        .end(function(err, res){
          if (err) done(err);
          done();
        });
    });
});

describe('GET /', function() {
    it('Retrun the value of one email send status and id', function(done) {
        supertest(app)
        .request(app)
        .get('/:id')
        .set({
            id : "21354wdawdawda8w6dawd2aw1dawdwa5",
            status: "SENT"
        })
        .expect(200)
        .end(function(err, res){
            if (err) done(err);
            done();
          });
    });
  });

