import type { RequestHandler } from "express";
import AlreadyAuthenticatedError from "../../../../shared/domain/errors/already.authenticated.error"

const isAuthenticated: RequestHandler = (req, res, next) => {
    if(req.cookies.token) {
        throw new AlreadyAuthenticatedError()
    }

    next();
}

export default isAuthenticated;