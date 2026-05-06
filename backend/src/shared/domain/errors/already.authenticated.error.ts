import { AppError } from "./AppError";

class AlreadyAuthenticatedError extends AppError {
  constructor() {
    super("Already logged in", 400, true);
  }
}

export default AlreadyAuthenticatedError;