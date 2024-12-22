import jwt from 'jsonwebtoken';

// Chave secreta para assinatura do token (pode ser um ENV)
const secretKey = 'GokuMelhorQueNaruto';

export const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  };