import { AppError } from "./AppError";

export default class Unauthorized extends AppError {
    constructor(message: string) {
        super(message, 401)
    }
}