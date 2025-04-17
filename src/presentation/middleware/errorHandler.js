import AppError from '../../infrastructure/errors/AppError.js';
import { validationResult } from 'express-validator';

/**
 * Middleware para tratar erros de validação do express-validator
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const appError = AppError.validationError(errors.array());
    return res.status(appError.statusCode).json({
      ...appError.toJSON(),
      errors: appError.errors
    });
  }
  next();
};

/**
 * Middleware para tratar todos os erros da aplicação
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const validationError = AppError.validationError(
      err.errors.map(e => ({ param: e.path, msg: e.message }))
    );
    return res.status(validationError.statusCode).json({
      ...validationError.toJSON(),
      errors: validationError.errors
    });
  }

  if (err.message === 'Sacola não encontrada') {
    const notFoundError = AppError.notFound('Sacola', req.params.id || 'desconhecido');
    return res.status(notFoundError.statusCode).json(notFoundError.toJSON());
  }

  const serverError = AppError.internal(
    'Ocorreu um erro interno no servidor', 
    process.env.NODE_ENV !== 'production' ? err : null
  );
  
  return res.status(serverError.statusCode).json(serverError.toJSON());
};