import { body, validationResult } from 'express-validator';
import AppError from '../../infrastructure/errors/AppError.js';

export const validateRegisterInput = [
  body('entityType').isIn(['client', 'business']).withMessage('Tipo de entidade deve ser "client" ou "business"'),
  body('userData.email').isEmail().withMessage('Email inválido'),
  body('userData.password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  
  body('entityData.name').if(body('entityType').equals('client')).notEmpty().withMessage('Nome é obrigatório'),
  body('entityData.cpf').if(body('entityType').equals('client')).matches(/^\d{11}$/).withMessage('CPF inválido'),
  body('entityData.phone').if(body('entityType').equals('client')).matches(/^\d{10,11}$/).withMessage('Telefone inválido'),
  
  body('entityData.legalName').if(body('entityType').equals('business')).notEmpty().withMessage('Razão social é obrigatória'),
  body('entityData.appName').if(body('entityType').equals('business')).notEmpty().withMessage('Nome fantasia é obrigatório'),
  body('entityData.cnpj').if(body('entityType').equals('business')).matches(/^\d{14}$/).withMessage('CNPJ inválido'),
  body('entityData.cellphone').if(body('entityType').equals('business')).matches(/^\d{10,11}$/).withMessage('Celular inválido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      throw new AppError(
        'Erro de validação',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }
    next();
  }
];

export const validateLoginInput = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      throw new AppError(
        'Erro de validação',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }
    next();
  }
];

export const validateFirebaseLoginInput = [
  body('firebaseToken').notEmpty().withMessage('Token do Firebase é obrigatório'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      throw new AppError(
        'Erro de validação',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }
    next();
  }
];

export const validateChangePasswordInput = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      throw new AppError(
        'Erro de validação',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }
    next();
  }
];

export const validateDeviceTokenInput = [
  body('deviceToken').notEmpty().withMessage('Token do dispositivo é obrigatório'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map(error => error.msg);
      throw new AppError(
        'Erro de validação',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }
    next();
  }
];