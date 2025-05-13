const jwt = require('jsonwebtoken');
const { findUserByUserId, verifyUser } = require('../services/auth.service');
const { secretKey } = require('../config');

module.exports = {
  login: async (req, res) => {
    const { userId, password } = req.body;

    const user = verifyUser(userId, password); // ✅ 먼저 유저 검증
    if (!user) {
      return res.status(401).json({ message: '등록되지 않은 유저입니다.' });
    }

    const token = jwt.sign(
      { userId: user.userId },
      secretKey,
      {
        expiresIn: '15m', // ✅ '15' → '15m' 수정
      }
    );

    return res.status(200).json({ token });
  },

  me: async (req, res) => {
    const { userId } = req.decoded;
  
    const user = findUserByUserId(userId);
    if (!user) {
      return res.status(404).json({ message: 'user를 찾을 수 없습니다' });
    }
  
    return res.status(200).json({
      message:"사용자 정보입니다",
      user: {
        userId: user.userId,
        email: user.email,
      },
    });
  },
  
};
