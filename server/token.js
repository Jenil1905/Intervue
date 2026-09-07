const jwt = require('jsonwebtoken');

async function generateToken(id){
    const secret = process.env.JWT_SECRET || 'intervue_secret_key_2026';
    return jwt.sign({id}, secret, {expiresIn: '30d'});
}

module.exports = generateToken;