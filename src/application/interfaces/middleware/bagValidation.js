const { body, param } = require('express-validator');
const { handleValidationErrors } = require('./errorHandler');

/**
 * Validações para criação de sacolas
 */
const validateCreateBag = [
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

  // Aplica o middleware de validação após as regras
  handleValidationErrors
];

/**
 * Validações para atualização de sacolas
 */
const validateUpdateBag = [
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

  // Aplica o middleware de validação após as regras
  handleValidationErrors
];

/**
 * Validação do parâmetro ID da sacola
 */
const validateBagId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID da sacola deve ser um número inteiro positivo'),

  // Aplica o middleware de validação após as regras
  handleValidationErrors
];

/**
 * Validação do parâmetro ID da empresa
 */
const validateCompanyId = [
  param('companyId')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  // Aplica o middleware de validação após as regras
  handleValidationErrors
];

/**
 * Validações específicas para alteração de status
 */
const validateStatusUpdate = [
  body('status')
    .exists()
    .withMessage('Status é obrigatório')
    .isIn([0, 1])
    .withMessage('Status deve ser 0 (inativo) ou 1 (ativo)'),

  // Aplica o middleware de validação após as regras
  handleValidationErrors
];

module.exports = {
  validateCreateBag,
  validateUpdateBag,
  validateBagId,
  validateCompanyId,
  validateStatusUpdate
};