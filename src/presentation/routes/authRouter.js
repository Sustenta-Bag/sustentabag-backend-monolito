import { Router } from "express";

import validator from "../../presentation/middleware/validator.js";
import authValidator from "./authValidator.js";

import { login } from "../../presentation/controllers/userController.js";
import { generate } from "../../presentation/controllers/authController.js";

const router = Router();
router.post("/", validator(authValidator));
router.post("/", login, generate);

export default router;
