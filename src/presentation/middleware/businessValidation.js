import { body, param } from 'express-validator';
import { handleValidationErrors } from './errorHandler.js';

export const validateCreateBusiness = [
  body('legalName')
    .exists()
    .withMessage('Razão social (legalName) é obrigatória')
    .bail()
    .isString()
    .withMessage('legalName deve ser uma string'),

  body('cnpj')
    .exists()
    .withMessage('CNPJ é obrigatório')
    .bail()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve conter exatos 14 dígitos numéricos'),

  body('appName')
    .exists()
    .withMessage('Nome de exibição (appName) é obrigatório')
    .bail()
    .isString()
    .withMessage('appName deve ser uma string'),

  body('cellphone')
    .exists()
    .withMessage('Cellphone é obrigatório')
    .bail()
    .matches(/^\d{11}$/)
    .withMessage('Cellphone deve conter 11 dígitos numéricos'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description deve ser uma string'),

  body('logo')
    .optional()
    .isString()
    .withMessage('Logo deve ser uma string (URL ou caminho)'),

  body('openingHours')
    .exists()
    .withMessage('OpeningHours é obrigatório')
    .bail()
    .isString()
    .withMessage('OpeningHours deve ser uma string'),

  body('password')
    .exists()
    .withMessage('Password é obrigatória')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password deve ter no mínimo 6 caracteres'),

  body('delivery')
    .optional()
    .isBoolean()
    .withMessage('Delivery deve ser booleano'),

  body('deliveryTax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('DeliveryTax deve ser um número positivo'),

  body('develiveryTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('DeveliveryTime deve ser um número inteiro não negativo'),

  body('idAddress')
    .exists()
    .withMessage('idAdress é obrigatório')
    .bail()
    .isInt({ min: 1 })
    .withMessage('idAdress deve ser um número inteiro positivo'),

  body('status')
    .optional()
    .isIn([0, 1, true, false, "true", "false"])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo), true(ativo) ou false(inativo)'),

  handleValidationErrors
];

export const validateUpdateBusiness = [
  body('legalName')
    .optional()
    .isString()
    .withMessage('legalName deve ser uma string'),

  body('cnpj')
    .optional()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve conter exatos 14 dígitos numéricos'),

  body('appName')
    .optional()
    .isString()
    .withMessage('appName deve ser uma string'),

  body('cellphone')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('Cellphone deve conter 11 dígitos numéricos'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description deve ser uma string'),

  body('logo')
    .optional()
    .isString()
    .withMessage('Logo deve ser uma string (URL ou caminho)'),  

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password deve ter no mínimo 6 caracteres'),

  body('delivery')
    .optional()
    .isBoolean()
    .withMessage('Delivery deve ser booleano'),

  body('deliveryTax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('DeliveryTax deve ser um número positivo'),

  body('idAddress')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idAdress deve ser um número inteiro positivo'),

  body('status')
    .optional()
    .isIn([0, 1, true, false, "true", "false"])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo), true(ativo) ou false(inativo)'),

  handleValidationErrors
];

export const validateBusinessId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),
  handleValidationErrors
];

export const validateCNPJ = [
  param('cnpj')
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve conter exatos 14 dígitos numéricos'),
  handleValidationErrors
];

export const validateStatusUpdate = [
  body('status')
    .exists()
    .withMessage('Status é obrigatório')
    .bail()
    .isIn([0, 1, true, false, "true", "false"])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo), true(ativo) ou false(inativo)'),
  handleValidationErrors
];