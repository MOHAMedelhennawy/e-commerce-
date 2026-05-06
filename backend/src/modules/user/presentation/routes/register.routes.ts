import express from "express";
import RegisterUserController from "../controller/register.controller";
import isAuthenticated from "../middlewares/authenticated.middleware";
import validate from "../../../../presentation/middlewares/validate.middleware";
import RegisterUserSchema from "../schemas/register.user.schema";

const RegisterRouter = (controller: RegisterUserController) => {
    const router = express.Router();
    router.post('/', isAuthenticated, validate(RegisterUserSchema), controller.handle);
    return router;
}

export default RegisterRouter;