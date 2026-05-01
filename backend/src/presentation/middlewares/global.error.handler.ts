import type { ErrorRequestHandler, Request, Response } from "express";
import { AppError } from "../../shared/domain/errors/AppError.ts";
import handlePrismaError from "../../infrastructure/errors/handle.prisma.errors.ts";
import handleZodError from "../errors/handle.zod.error.ts";
import BadRequestError from "../errors/bad.request.error.ts";

function normalizeError(err: unknown): AppError {
    // if AppError return it
    if (err instanceof AppError) {
        return err;
    }

    const zodMapped = handleZodError(err);
    if (zodMapped) {
        return zodMapped;
    }

    // if prisma error, convert to AppError and return it
    const prismaMapped = handlePrismaError(err);
    if (prismaMapped) {
        return prismaMapped;
    }

    if (err instanceof Error) {
        return new AppError(err.message, 500, false);
    }

    return new AppError("Internal server error", 500, false);
}

const isDevelopment = (): boolean => process.env.NODE_ENV === "development";

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
    const statusCode = err.statusCode ?? 500;
    if (req.originalUrl.startsWith("/api")) { // For APIs
        res.status(statusCode).json({
            status: err.status,
            message: err.message,
            errors: err instanceof BadRequestError? err.errors : undefined,
            stack: err.stack,
            isOperational: err.isOperational,
        });
    } else {
        res.status(statusCode).render("error", { // For pages
            title: "Something went wrong!",
            msg: err.message,
        });
    }
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    const statusCode = err.statusCode ?? 500;

    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(statusCode).json({
                status: err.status,
                message: err.message,
                errors: err instanceof BadRequestError? err.errors : undefined,
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Please try again later",
        });
    }

    // if is exptected error "Operational error" return to client
    if (err.isOperational) {
        return res.status(statusCode).render("error", {
            title: "Something went wrong",
            msg: err.message,
        });
    }

    // if not operational error return generic message to client.
    return res.status(500).render("error", {
        title: "Something went wrong",
        msg: "Please try again later",
    });
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // convert any error to AppError
    const normalized = normalizeError(err);

    // if unexpected error happen in production log it
    if (!isDevelopment() && !normalized.isOperational) {
        console.error("ERROR", err);
    }

    if (isDevelopment()) {
        sendErrorDev(normalized, req, res);
    } else {
        sendErrorProd(normalized, req, res);
    }
};

export default globalErrorHandler;