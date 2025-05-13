const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

module.exports = {
  auth: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: '토큰이 존재하지 않습니다.' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: '토큰 형식이 잘못되었습니다.' });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      req.decoded = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(419).json({ message: '토큰이 만료되었습니다.' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }

      return res.status(500).json({ message: '서버 에러' });
    }
  },
};
