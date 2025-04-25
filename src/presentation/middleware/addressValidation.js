import { body, param } from 'express-validator';
import { handleValidationErrors } from './errorHandler.js';

export const validateCreateAddress = [
  body('zipCode')
    .exists()
    .withMessage('zipCode é obrigatório')
    .bail()
    .matches(/^\d{8}$/)
    .withMessage('zipCode deve conter exatamente 8 dígitos numéricos'),

  body('state')
    .exists()
    .withMessage('State é obrigatório')
    .bail()
    .matches(/^[A-Z]{2}$/)
    .withMessage('State deve ser a sigla de 2 letras maiúsculas'),

  body('city')
    .exists()
    .withMessage('City é obrigatório')
    .bail()
    .isString()
    .withMessage('City deve ser uma string'),

  body('street')
    .exists()
    .withMessage('Street é obrigatório')
    .bail()
    .isString()
    .withMessage('Street deve ser uma string'),

  body('number')
    .exists()
    .withMessage('Number é obrigatório')
    .bail()
    .isString()
    .withMessage('Number deve ser uma string'),

  body('complement')
    .optional()
    .isString()
    .withMessage('Complement deve ser uma string'),

  handleValidationErrors
];

export const validateUpdateAddress = [
  body('zipCode')
    .optional()
    .matches(/^\d{8}$/)
    .withMessage('zipCode deve conter exatamente 8 dígitos numéricos'),

  body('state')
    .optional()
    .matches(/^[A-Z]{2}$/)
    .withMessage('zipCode deve ser a sigla de 2 letras maiúsculas'),

  body('city')
    .optional()
    .isString()
    .withMessage('City deve ser uma string'),

  body('street')
    .optional()
    .isString()
    .withMessage('Street deve ser uma string'),

  body('number')
    .optional()
    .isString()
    .withMessage('Number deve ser uma string'),

  body('complement')
    .optional()
    .isString()
    .withMessage('Complement deve ser uma string'),

  handleValidationErrors
];

export const validateAddressId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID do endereço deve ser um número inteiro positivo'),
  handleValidationErrors
];

export const validateZipCode = [
  param('zipCode')
    .matches(/^\d{8}$/)
    .withMessage('zipCode deve conter exatamente 8 dígitos numéricos'),
  handleValidationErrors
];