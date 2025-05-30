import { body, param } from 'express-validator';
import { handleValidationErrors } from './errorHandler.js';

const ALLOWED_TAGS = [
  'PODE_CONTER_GLUTEN',
  'PODE_CONTER_LACTOSE',
  'PODE_CONTER_LEITE',
  'PODE_CONTER_OVOS',
  'PODE_CONTER_AMENDOIM',
  'PODE_CONTER_CASTANHAS',
  'PODE_CONTER_NOZES',
  'PODE_CONTER_SOJA',
  'PODE_CONTER_PEIXE',
  'PODE_CONTER_FRUTOS_DO_MAR',
  'PODE_CONTER_CRUSTACEOS',
  'PODE_CONTER_GERGELIM',
  'PODE_CONTER_SULFITOS',
  'PODE_CONTER_CARNE'
];

export const validateCreateBag = [
  body('type')
    .isIn(['Doce', 'Salgada', 'Mista'])
    .withMessage('Tipo da sacola deve ser Doce, Salgada ou Mista'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),

  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string'),

  body('status')
    .optional()
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags deve ser um array')
    .custom((tags) => {
      if (!tags) return true;
      if (!Array.isArray(tags)) return false;
      return tags.every(tag => ALLOWED_TAGS.includes(tag));
    })
    .withMessage('Tags inválidas. Use apenas as tags permitidas.'),

  handleValidationErrors
];

export const validateUpdateBag = [
  body('type')
    .optional()
    .isIn(['Doce', 'Salgada', 'Mista'])
    .withMessage('Tipo da sacola deve ser Doce, Salgada ou Mista'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),

  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string'),

  body('status')
    .optional()
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags deve ser um array')
    .custom((tags) => {
      if (!tags) return true;
      if (!Array.isArray(tags)) return false;
      return tags.every(tag => ALLOWED_TAGS.includes(tag));
    })
    .withMessage('Tags inválidas. Use apenas as tags permitidas.'),

  handleValidationErrors
];

export const validateBagId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID da sacola deve ser um número inteiro positivo'),

  handleValidationErrors
];

export const validateBusinessId = [
  param('idBusiness')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  handleValidationErrors
];

export const validateStatusUpdate = [
  body('status')
    .exists()
    .withMessage('Status é obrigatório')
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  handleValidationErrors
];