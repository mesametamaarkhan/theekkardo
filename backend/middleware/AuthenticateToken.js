import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(403).json({ message: 'Access denied. No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if(error) {
            return res.status(403).json({ message: 'Invalid Token.' });
        }

        req.user = user;
        next();
    });
};

export default authenticateToken;