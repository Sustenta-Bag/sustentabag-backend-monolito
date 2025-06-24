import { body, param } from 'express-validator';
import { handleValidationErrors } from './errorHandler.js';

export const validateCreateOrder = [
  body('idBusiness')
    .isInt({ min: 1 })
    .withMessage('ID da empresa deve ser um número inteiro positivo'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Pedido deve conter pelo menos um item'),

  body('items.*.idBag')
    .isInt({ min: 1 })
    .withMessage('ID da sacola deve ser um número inteiro positivo'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),

  // body('paymentMethod')
  //   .isString()
  //   .notEmpty()
  //   .withMessage('Método de pagamento é obrigatório')
  //   .isIn(['credit_card', 'debit_card', 'pix', 'bank_transfer'])
  //   .withMessage('Método de pagamento inválido'),

  handleValidationErrors
];

export const validateOrderId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID do pedido deve ser um número inteiro positivo'),

  handleValidationErrors
];

export const validateOrderStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID do pedido deve ser um número inteiro positivo'),
  body('status')
    .isIn(['pendente', 'confirmado', 'pago', 'preparando', 'pronto', 'entregue', 'cancelado'])
    .withMessage('Status inválido'),

  handleValidationErrors
];

export const validateAddItem = [
  param('idOrder')
    .isInt({ min: 1 })
    .withMessage('ID do pedido deve ser um número inteiro positivo'),

  body('idBag')
    .isInt({ min: 1 })
    .withMessage('ID da sacola deve ser um número inteiro positivo'),

  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),

  handleValidationErrors
];

export const validateUpdateItemQuantity = [
  param('idOrder')
    .isInt({ min: 1 })
    .withMessage('ID do pedido deve ser um número inteiro positivo'),

  param('idItem')
    .isInt({ min: 1 })
    .withMessage('ID do item deve ser um número inteiro positivo'),

  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),

  handleValidationErrors
];

export const validateRemoveItem = [
  param('idOrder')
    .isInt({ min: 1 })
    .withMessage('ID do pedido deve ser um número inteiro positivo'),

  param('idItem')
    .isInt({ min: 1 })
    .withMessage('ID do item deve ser um número inteiro positivo'),

  handleValidationErrors
]; 