import ERROR from "../../../../shared/domain/errors/error.messages";
import { USER_LIMITS } from "../../../../shared/domain/constants/domain.constants";
import { ValidationError } from "../../../../shared/domain/errors/domain.errors";

export default class Email {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    private constructor(private readonly value: string) {}

    toString(): string {
        return this.value;
    }
    static create(value: string): Email {
        const len = value.length;
        
        if (len < USER_LIMITS.EMAIL.MIN) {
            throw new ValidationError(ERROR.USER.EMAIL.TOO_SHORT(len));
        }
        if (len > USER_LIMITS.EMAIL.MAX) {
            throw new ValidationError(ERROR.USER.EMAIL.TOO_LONG(len));
        }
        if (!Email.EMAIL_REGEX.test(value)) {
            throw new ValidationError(ERROR.USER.EMAIL.INVALID);
        }

        return new Email(value);
    }

    static reconstitute(value: string) {
        return new Email(value);
    }
}