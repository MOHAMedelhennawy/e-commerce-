import { AppError } from "./AppError";

export default class Conflict extends AppError {
    constructor(message: string) {
        super(message, 409)
    }
}