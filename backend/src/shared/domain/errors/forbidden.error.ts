import { AppError } from "./AppError";

export default class Forbidden extends AppError {
  constructor() {
    super("Forbidden", 403, true);
  }
}