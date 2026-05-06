import LoginUser from "../../application/services/login.user.service"
import type { RequestHandler } from "express";
import type LoginUserInputDTO from "../../application/dtos/login/login.user.input.dto";
import type LoginUserOutputDTO from "../../application/dtos/login/login.user.output.dto";

export default class LoginUserController {
    constructor(private service: LoginUser){}

    handle: RequestHandler = async (req, res, next) => {
        const payload: LoginUserInputDTO = req.body;
    
        const result: LoginUserOutputDTO = await this.service.execute({
            email: payload.email,
            password: payload.password
        })

        // Set cookies
        res.cookie("token", result.token, {
            maxAge: 60 * 60 * 24 * 1000, // 1 day
            httpOnly: true,
            sameSite: "strict",
        })

        res.status(200).json({
            status: "Success",
            message: "Logged in successfully",
        })
    }
}