require('dotenv').config({ path: '../../.env' })
const router = require('express').Router();
const pool = require('../../db');
const argon2 = require('argon2');
const cookieSesh = require('cookie-session');
const session  = require('express-session');
const uuid = require('uuid');
const path = require('path');
const cookieParser = require('cookie-parser')

// uncomment for redis store
// const connectRedisStore = require('connect-redis')(session)
// const { createClient } = require('redis');
// const client = createClient();
// const store = new connectRedisStore({client: client})


// -- middleware -- //

router.use(cookieParser())

router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false, secure: false, sameSite: false},
    name: 'session',
    //store: store
}))

// verify auth
router.get("/verify-auth", async(req, res) => {
    console.log('Cookies: ', req.cookies)

    try {
        if(req.session.userId){
        console.log('verify-auth good');
        res.json({"verified": true});
        }
    } catch (error) {
        console.log('verify-auth error');
        req.session.error = 'Access denied!';
        console.error(error.message);
        res.status(500).json({"verified": false});
    }
})

// restrict routes
function restrict(req, res, next) {
    if (req.session.userId) { next() } 
    else {
        console.log('try restrict bad');
        req.session.error = 'Access denied!';
    }
}


// -- routes -- //

router.get('/', restrict, async(req, res) => {
    res.send('auth home');
})

router.post('/login', async(req, res) => {
    try {
        // destructor req.body
        const { email, password } = req.body;
        console.log(email, password)

        // check user existence
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0){
            console.log('bad email');
            return res.status(401).send("Email or Password is invalid");
        }

        // check pwd 
        const validatePwd = await argon2.verify(user.rows[0].user_password, password);

        if (!validatePwd){
            console.log('bad pass');
            return res.status(401).send("Email or Password is invalid");
        }

        // give cookie

        console.log('giving cookie', user.rows[0].user_id);
        //req.session.regenerate(() => {
        req.session.userId = user.rows[0].user_id;       
        //})
        res.send('now auth');
        

    } 
    catch (error) {
        console.error('login error', error.message);
        res.status(500).send("server login error"); 
    }
})


// logout, destroy session
router.get('/logout', restrict, (req, res) => {
    req.session.destroy(() => {
        console.log('Session Destroyed and logout complete');
    });
    res.json({"verified": false}).redirect('/');
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

        // cookie
        res.status(200);
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("server error");  
    }
})


module.exports = router;
