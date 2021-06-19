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

    /// 3.30am 12.30pm 
    
 
    let currentTime = new Date();
    const UnixTimeFor1H = 3600000 ; // 3600 mili seconds = 1 H

    let local330Am =  new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(),3,30,00,00);
    let local1230Pm = new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate(),12,30,00,00);
    let localNextDay12AM = UnixTimeFor1H * 11.5  + local1230Pm.valueOf();
    let localNextDay8AM = localNextDay12AM + UnixTimeFor1H * 8;

    // console.log("c Time : " , currentTime.valueOf());
    // console.log("c l330 : " , local330Am.valueOf());
    // console.log("c l1230 : " , local1230Pm.valueOf());
    // console.log("c n12 : " , localNextDay12AM.valueOf());
    // console.log("c n8 : " , localNextDay8AM.valueOf());
    if( local1230Pm.valueOf()  > currentTime.valueOf() && local330Am.valueOf()  < currentTime.valueOf()){
        sendMailAt = currentTime.valueOf();
        // console.log("c1 : " , sendMailAt.valueOf());
        return true;
    }
    else if (local1230Pm.valueOf()  < currentTime.valueOf() && localNextDay12AM.valueOf()  > currentTime.valueOf()){
        sendMailAt = localNextDay8AM.valueOf();
        // console.log("c2 : " , sendMailAt.valueOf());
        return false;
    }else{
        sendMailAt = local330Am.valueOf();
        // console.log("c3 : " , sendMailAt.valueOf());
        return false;
    }
}




router.post('/', async (req,respose) =>{
    
    console.log("[POST] Incomming data from front-end : " , req.body);

    sendEmailAt();
  console.log(sendMailAt/1000);
    let sendMail;
    
    sendMail = new Mail( {
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html,
        send_at: parseInt( sendMailAt/1000 ),
        status: sendEmailAt() ? "SENT": "QUEUED"
    });

    // if sl time 3.30AM - 12.30PM msg send 
    sendEmailAt() ? 
    sendMailNow(sendMail,respose):

    //if after 12.30pm msg que.
    sendMailNexdayMorning(sendMail,respose);
   
  
});



async function sendMailNow(sendMail,respose){
try {
    await sgMail.send(sendMail).then((res) => {
        if(res[0].statusCode == 202){// if successfuly sent the email
            console.log("SENT", res[0].statusCode);
           
            sendMail.save()
            .then(data =>{
            let details = {
                id: data._id,
                status: data.status
            }
            respose.json(details);
          
            }).catch(err =>{
            respose.json({message: err});
            });
        }
      });

    
    } catch (error) {
        console.log(error);
    }
};

async function sendMailNexdayMorning(sendMail,respose){
    
    try {
        await  sgMail.send(sendMail).then((res) => {
           if(res[0].statusCode == 202){// if successfuly sent the email
  
            sendMail.save()
              .then(data =>{
              let details = {
                  id: data._id,
                  status: data.status
              }
              respose.json(details);
              
              }).catch(err =>{
              respose.json({message: err});
              });
            }  
        });
         // respose.json(sendMail);
    } catch (error) {
      console.log(error);
     
    };
};





module.exports = router;