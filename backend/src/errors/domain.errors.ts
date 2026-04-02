import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class InsufficientStockError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}