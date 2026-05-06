import ERROR from "../../shared/domain/errors/error.messages";
import Unauthorized from "../../shared/domain/errors/unauthorized.error";
import type { NextFunction, Request, Response } from "express";
import type ITokenService from "../../modules/user/application/interfaces/token.service.interface";

const requireAuth = (tokenService: ITokenService) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        throw new Unauthorized(ERROR.AUTH.REQUIRED);
    }

    const decoded = tokenService.verify(token);
    if (!decoded) {
        throw new Unauthorized(ERROR.AUTH.REQUIRED);
    }

    req.user = decoded;
    next();
}

export default requireAuth;