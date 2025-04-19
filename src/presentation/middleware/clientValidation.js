import { body, param } from "express-validator";
import { handleValidationErrors } from "./errorHandler.js";

export const validateCreateClient = [
  body("name")
    .isString()
    .withMessage("Nome deve ser uma string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("email")
    .isEmail()
    .withMessage("Email deve ser um endereço de email válido"),

  body("cpf")
    .matches(/^\d{11}$/)
    .withMessage("CPF deve conter 11 dígitos numéricos"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres"),

  body("phone")
    .matches(/^\d{10,11}$/)
    .withMessage("Telefone deve conter entre 10 e 11 dígitos numéricos"),

  body("status")
    .optional()
    .isIn([0, 1])
    .withMessage("Status deve ser 0 (inativo) ou 1 (ativo)"),

  handleValidationErrors,
];

export const validateUpdateClient = [
  body("name")
    .optional()
    .isString()
    .withMessage("Nome deve ser uma string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email deve ser um endereço de email válido"),

  body("cpf")
    .optional()
    .matches(/^\d{11}$/)
    .withMessage("CPF deve conter 11 dígitos numéricos"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres"),

  body("phone")
    .optional()
    .matches(/^\d{10,11}$/)
    .withMessage("Telefone deve conter entre 10 e 11 dígitos numéricos"),

  body("status")
    .optional()
    .isIn([0, 1])
    .withMessage("Status deve ser 0 (inativo) ou 1 (ativo)"),

  handleValidationErrors,
];

export const validateClientId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID do cliente deve ser um número inteiro positivo"),

  handleValidationErrors,
];

export const validateStatusUpdate = [
  body("status")
    .exists()
    .withMessage("Status é obrigatório")
    .isIn([0, 1])
    .withMessage("Status deve ser 0 (inativo) ou 1 (ativo)"),

  handleValidationErrors,
];

export const validateLogin = [
  body("cpf")
    .matches(/^\d{11}$/)
    .withMessage("CPF deve conter 11 dígitos numéricos"),

  body("password").exists().withMessage("Senha é obrigatória"),

  handleValidationErrors,
];
