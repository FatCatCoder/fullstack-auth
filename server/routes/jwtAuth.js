const router = require('express').Router();
const pool = require('../db');
const argon2 = require('argon2');
const jwtGenerator = require('../utils/jwtGenerator');
const jwtValidate = require('express-jwt');
require('dotenv').config()


//routes

router.get('/', jwtValidate({secret: process.env.SECRET, algorithms: ['HS256']}), (req, res) => {
    res.send('<h1>Welcome to the authorized homepage!</h1>');
})

router.post('/login', async(req, res) => {
    try {
        // destructor req.body
        const { email, password } = req.body;

        // check user existence
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0){
            return res.status(401).json("Email or Password is invalid");
        }

        // check pwd 

        const validatePwd = await argon2.verify(user.rows[0].user_password, password);

        if (!validatePwd){
            return res.status(401).json("Email or Password is invalid");
        }

        // give jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });


    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("server error"); 
    }
})

router.post('/register', async(req, res) => {
    try {
        // destructor req.body
        const { name, email, password } = req.body;

        // check if exists, ensures unique name and email
        const user = await pool.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2", [name, email])
        if (user.rows.length !== 0){
            return res.status(401).send('User Exists!');
        }
        // argon2id hash the password
        const hash = await argon2.hash(password, {type: argon2.argon2id});

        //add new user to db
        const newUser = await pool.query("INSERT INTO users(user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *", [name, email, hash]);

        // generate jwt or just redirect to login
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({ token });
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("server error");  
    }
})


module.exports = router;
