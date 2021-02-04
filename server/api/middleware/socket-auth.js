const jwt = require('jsonwebtoken');

module.exports = (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        socket.loggedInUserData = decoded;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
};