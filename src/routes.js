import { Router } from "express";

import order from "./infrastructure/middlewares/order.js";
import hateoas from "./infrastructure/middlewares/hateoas.js";
import handler from "./infrastructure/middlewares/handlers.js";

import InternalServerError from "./infrastructure/routes/helper/500.js"
import NotFound from "./infrastructure/routes/helper/404.js";

import AuthRouter from "./infrastructure/routes/authRouter.js";
import UserRouter from "./infrastructure/routes/userRouter.js";

import { verify } from "./infrastructure/controllers/authController.js";

const routes = Router()
routes.use(order);
routes.use(hateoas);
routes.use(handler);

routes.use("/login", AuthRouter);
routes.use("/api/users", verify, UserRouter);

routes.use(InternalServerError);
routes.use(NotFound);

export default routes;
