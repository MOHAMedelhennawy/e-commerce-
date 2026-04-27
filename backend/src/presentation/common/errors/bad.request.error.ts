import { AppError } from "../../../shared/errors/AppError";

export default class BadRequestError extends AppError {
    public errors: Record<string, string>;

    constructor(errors: Record<string, string>) {
        super("Validation error", 400);
        this.errors = errors;
    }
}