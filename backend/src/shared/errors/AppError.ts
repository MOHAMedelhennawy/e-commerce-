export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    /** Express-style payload field (e.g. `"error"` | `"fail"`). */
    status: string;

    constructor(
        message: string,
        statusCode: number,
        isOperational = true,
        status: string = "error",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}