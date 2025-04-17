import { body, param } from 'express-validator';
import { handleValidationErrors } from './errorHandler.js';

/**
 * Validações para criação de sacolas
 */
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

  body('companyId')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  body('status')
    .optional()
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  handleValidationErrors
];

/**
 * Validações para atualização de sacolas
 */
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

  body('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  body('status')
    .optional()
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  handleValidationErrors
];

/**
 * Validação do parâmetro ID da sacola
 */
export const validateBagId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID da sacola deve ser um número inteiro positivo'),

  handleValidationErrors
];

/**
 * Validação do parâmetro ID da empresa
 */
export const validateCompanyId = [
  param('companyId')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  handleValidationErrors
];

/**
 * Validações específicas para alteração de status
 */
export const validateStatusUpdate = [
  body('status')
    .exists()
    .withMessage('Status é obrigatório')
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  handleValidationErrors
];