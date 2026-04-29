import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import ERROR from "../../../../shared/errors/error.messages";

export default class Email {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    private constructor(private readonly value: string) {}

    static create(value: string): Email {
        const len = value.length;

        if (len < 5) {
            throw new ValidationError(ERROR.USER.EMAIL.TOO_SHORT(len));
        }
        if (len > 255) {
            throw new ValidationError(ERROR.USER.EMAIL.TOO_LONG(len));
        }
        if (!Email.EMAIL_REGEX.test(value)) {
            throw new ValidationError(ERROR.USER.EMAIL.INVALID);
        }

        return new Email(value);
    }

    toString(): string {
        return this.value;
    }
}