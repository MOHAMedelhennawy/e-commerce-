import type { RequestHandler } from "express";
import RegisterUserService from "../../application/services/register.user.service";
import type RegisterUserInputDTO from "../../application/dtos/register/register.user.input.dto";

export default class RegisterUserController {
    constructor(private service: RegisterUserService){}

    handle: RequestHandler = async (req, res, next) => {
        const payload: RegisterUserInputDTO = req.body;
        const result = await this.service.execute(payload);
        res.status(200).json({
            success: true,
            result
        });
    }
}