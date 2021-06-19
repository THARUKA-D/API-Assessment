const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({
    
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
        type: Number,
        default: null
    },
    status:{ 
        type:String,
        default:"FAILED"
    }
     
});
module.exports = mongoose.model('Mail', mailSchema);