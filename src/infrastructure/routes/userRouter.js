import { Router } from "express";

import {
  listUsers,
  showUser,
  createUser,
  editUser,
  deleteUser,
} from "../controllers/userController.js";

import validator from "../middlewares/validator.js";
import schema from "./userValidator.js";

const router = Router();
router.get("/", listUsers);
router.get("/:_id", showUser);
router.post("/", validator(schema), createUser);
router.put("/:_id", validator(schema), editUser);
router.delete("/:_id", deleteUser);

export default router;
