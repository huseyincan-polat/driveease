const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    const tokenStr = token.split(' ')[1];
    
    jwt.verify(tokenStr, process.env.JWT_SECRET || 'mysecretkey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
};

// Rota dosyalarınızla uyumlu olması için iki isimle de dışarı aktarıyoruz
module.exports = { 
    verifyToken, 
    isAdmin,
    authenticate: verifyToken, 
    adminOnly: isAdmin 
};