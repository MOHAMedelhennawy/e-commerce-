import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import ERROR from "../../../../shared/errors/error.messages";

export default class Name {
    private constructor(private readonly fullName: string) {}

    toString(): string {
        return this.fullName;
    }

    static create(fullName: string) {
        const len: number = fullName.length;

        if (len < 2) {
            throw new ValidationError(ERROR.USER.NAME.TOO_SHORT(len));
        }
        if (len > 100) {
            throw new ValidationError(ERROR.USER.NAME.TOO_LONG(len));
        }

        return new Name(fullName);
    }
}