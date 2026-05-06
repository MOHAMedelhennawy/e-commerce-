import Forbidden from "../../shared/domain/errors/forbidden.error";
import type { RequestHandler } from "express";
import type { TPayload } from "../../modules/user/application/interfaces/token.service.interface";

const requireAdmin: RequestHandler = (req, res, next) => {
    const user: TPayload = req.user;

    if (user.role !== "ADMIN") {
        throw new Forbidden();
    }

    next();
}

export default requireAdmin;