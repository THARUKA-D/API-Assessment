const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyPharser = require('body-parser');
require('dotenv/config');

const PORT = 2010;

//connecting to mongo DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_KEY,
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,  },
    () => console.log('Connected to mongo DB..')
);
app.use(bodyPharser.json());

//Imports Routes
const mailRoute = require('./routes/mailHandel');

// //Middleware
app.use(express.static('public'));
app.use('/v1/emails', mailRoute);



//how we start to listner
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
}); // prot name 


module.exports = app; // for testing