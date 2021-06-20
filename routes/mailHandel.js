const express = require('express');
const sgMail = require('@sendgrid/mail');
const path = require("path");
const Mail = require('../models/mail')
const  router = express.Router();
require('dotenv/config');

//const API_KEY  = "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";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.use(express.static('public'));// giving access to the html page with its css file and js file  

router.get('/',(req,res) =>{
    res.sendFile(path.resolve('public/homPage.html'));
});

 

router.get('/:id', async (req,res) =>{ //[GET]
    console.log("[GET] Incomming data from front-end, email id:" , req.params.id);
   try {
       const object = await Mail.findById(req.params.id);
       const searchedMail = {
           id : object.id,
           status: object.status
       }
       res.json(searchedMail);
   } catch (error) {
    res.json("Error !!");
   }  
});

router.delete('/:id', async (req,res) =>{//[DELETE]
    console.log("[DELETE] Incomming data from front-end, email id:" , req.params.id);
   
    try {
        const object = await Mail.findByIdAndDelete(req.params.id);
        const searchedMail = {
            id : object.id,
            delete: object == null? "Email Not Found":"Successful"
        }
        res.send(searchedMail);
    } catch (error) {
        const searchedMail = {
            id : object.id,
            delete: "Faild"
        }
        res.send(searchedMail);
    }  
 });
 
let sendMailAt = 0;

function sendEmailAt(){ // (Sydney time) to set the time to send the mail 

    let currentTime = new Date();
    const UnixTimeFor1H = 3600000 ; // 3600000 mili seconds = 1 H

    let local330Am =  new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(),3,30,00,00);
    let local1230Pm = new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(),12,30,00,00);
    let localNextDay12AM = UnixTimeFor1H * 11.5  + local1230Pm.valueOf();
    let localNextDay8AM = localNextDay12AM + UnixTimeFor1H * 8;

   
    if( local1230Pm.valueOf()  > currentTime.valueOf() && local330Am.valueOf()  < currentTime.valueOf()){
        sendMailAt = currentTime.valueOf();
        return true;
    }
    else if (local1230Pm.valueOf()  < currentTime.valueOf() && localNextDay12AM.valueOf()  > currentTime.valueOf()){
        sendMailAt = localNextDay8AM.valueOf();
      
        return false;
    }else{
        sendMailAt = local330Am.valueOf();
        return false;
    }
}




router.post('/', async (req,respose) =>{
    
    console.log("[POST] Incomming data from front-end : " , req.body);

    sendEmailAt();
    console.log(sendMailAt/1000);
    let sendMail;
    
    sendMail =  {
        to: req.body.to,
        from:{
            email:"tharukajn@gmail.com",
            name: "Tharuka Jayasooriya"
        },
        subject: req.body.subject,
        html: req.body.html,
        send_at: parseInt( sendMailAt/1000),
       
    };
    console.log("sendMailAt/1000");

    try {
        await  sgMail.send(sendMail).
        then((res) => {
            console.log("Email status code", res[0].statusCode); 
          
        });
    }     
    catch (error) {

      let saveMail  = new Mail({
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html,
        });

        saveMail.save()
        .then(data =>{
            let details = {
                id: data._id,
                status: data.status
            }
        respose.json(details);
        }).catch(err =>{
            console.log("Email status code : Failed!"); 
        })
    };

    var events = req.body;
    console.log("EVENT body", events);
    events.forEach(function (deliveryEvent) {
        // Here, you now have each event and can process them how you like
        console.log("EVENT ", deliveryEvent.event);

        processEvent(deliveryEvent);
        let mailStatus;

        if(deliveryEvent.event == "Processed"){// meaning is mail is queued
            mailStatus = "QUEUED";
        } 

        if(deliveryEvent.event == "delivered"){// meaning is mail is sent
            mailStatus = "SENT";
        } 

        // update the db 

        let saveMail  = new Mail({
            _id: deliveryEvent.sg_message_id,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.html,
            send_at:  `${sendMailAt/1000}`,
            status:deliveryEvent.event,
            });
    
            saveMail.save()
            .then(data =>{
                let details = {
                    id: data._id,
                    status: data.status
                }
            respose.json(details);
            }).catch(err =>{
                respose.json({message: err});
        });
    });
});


module.exports = router;
