const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({

    id:String,
    
    to:String,
    from: {
        name: {
            type:String,
            default:"Tharuka Jayasooriya"
        },
        email:{
            type:String,
            default:"tharukajn@gmail.com"
        } 
    },
    subject: String,
    html: String,
    send_at:  {
        type: String,
        default: "Format Error"
    },
    status:{ 
        type:String,
        default:"FAILED"
    }
     
});
module.exports = mongoose.model('Mail', mailSchema);