import jwt from 'jsonwebtoken';
import AppError from '../../infrastructure/errors/AppError.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('Token de autenticação não fornecido', 'MISSING_TOKEN', 401);
    }
    
    const [scheme, token] = authHeader.split(' ');
    
    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError('Formato de token inválido', 'INVALID_TOKEN_FORMAT', 401);
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'sustentabag_secret_key', (err, decoded) => {
      if (err) {
        throw new AppError('Token inválido ou expirado', 'INVALID_TOKEN', 401);
      }
      
      req.userId = decoded.id;
      return next();
    });
  } catch (error) {
    next(error);
  }
};