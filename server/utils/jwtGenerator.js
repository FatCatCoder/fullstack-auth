const jwt = require('jsonwebtoken');
require('dotenv').config();

// jwt gen
const generateToken = (user_id) => {

    const payload = {
        user: {id: user_id}
    }
    return jwt.sign(payload, process.env.SECRET, {expiresIn: '120s'})
}

module.exports = generateToken;