const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'intervue_secret_key_2026';
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
};

module.exports = isAuth;