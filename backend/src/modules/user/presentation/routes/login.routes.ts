import express from "express";
import LoginUserController from "../controller/login.controller";
import validate from "../../../../presentation/middlewares/validate.middleware";
import LoginUserSchema from "../schemas/login.user.schema";
import isAuthenticated from "../middlewares/authenticated.middleware";

const LoginRouter = (constroller: LoginUserController) => {
    const router = express.Router();
    router.post('/', isAuthenticated, validate(LoginUserSchema), constroller.handle);
    return router;
}

export default LoginRouter;