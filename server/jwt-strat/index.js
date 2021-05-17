const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const PORT = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use('/', helmet(), require('./routes/jwtAuth'));


//server running
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
})