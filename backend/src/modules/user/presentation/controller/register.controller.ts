import type { RequestHandler } from "express";
import RegisterUserService from "../../application/services/register.user.service";
import type RegisterUserInputDTO from "../../application/dtos/register/register.user.input.dto";
import type RegisterUserOutputDTO from "../../application/dtos/register/register.user.output.dto";

export default class RegisterUserController {
    constructor(private service: RegisterUserService){}

    handle: RequestHandler = async (req, res, next) => {
        const payload: RegisterUserInputDTO = req.body;
        const result: RegisterUserOutputDTO = await this.service.execute(payload);

        res.cookie("token", result.token, {
            maxAge: 60 * 60 * 24 * 1000, // 1 day
            httpOnly: true,
            sameSite: "strict",
        })

        res.status(201).json({
            success: true,
        });
    }
}