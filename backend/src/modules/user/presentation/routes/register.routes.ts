import express from "express";
import RegisterUserController from "../controller/register.controller";
import validate from "../../../../presentation/common/middlewares/validate.middleware";
import RegisterUserSchema from "../schemas/register.user.schema";

const RegisterRouter = (controller: RegisterUserController) => {
    const router = express.Router();
    router.post('/', validate(RegisterUserSchema), controller.handle);
    return router;
}

export default RegisterRouter;