const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
              if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch(err){
        return res.status(401).json({message: 'Unauthorized'});
    }
}
module.exports = isAuth;