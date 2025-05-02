import jwt from 'jsonwebtoken';
import AppError from '../../infrastructure/errors/AppError.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('Token não fornecido', 'MISSING_TOKEN', 401);
    }
    
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw new AppError('Formato de token inválido', 'INVALID_TOKEN_FORMAT', 401);
    }
    
    jwt.verify(
      token, 
      process.env.JWT_SECRET || 'sustentabag_secret_key',
      (err, decoded) => {
        if (err) {
          throw new AppError('Token inválido ou expirado', 'INVALID_TOKEN', 401);
        }
        
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export const requireClientRole = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Não autenticado', 'NOT_AUTHENTICATED', 401);
    }
    
    if (req.user.role !== 'client') {
      throw new AppError('Acesso permitido apenas para clientes', 'ACCESS_DENIED', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export const requireBusinessRole = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Não autenticado', 'NOT_AUTHENTICATED', 401);
    }
    
    if (req.user.role !== 'business') {
      throw new AppError('Acesso permitido apenas para empresas', 'ACCESS_DENIED', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAnyRole = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Não autenticado', 'NOT_AUTHENTICATED', 401);
    }
    
    if (req.user.role !== 'client' && req.user.role !== 'business' && req.user.role !== 'admin') {
      throw new AppError('Acesso negado', 'ACCESS_DENIED', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};