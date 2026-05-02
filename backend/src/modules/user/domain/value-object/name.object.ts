import ERROR from "../../../../shared/domain/errors/error.messages";
import { USER_LIMITS } from "../../../../shared/domain/constants/domain.constants";
import { ValidationError } from "../../../../shared/domain/errors/domain.errors";

export default class Name {
    private constructor(private readonly fullName: string) {}

    toString(): string {
        return this.fullName;
    }

    static create(fullName: string) {
        const len: number = fullName.length;

        if (len < USER_LIMITS.NAME.MIN) {
            throw new ValidationError(ERROR.USER.NAME.TOO_SHORT(len));
        }
        if (len > USER_LIMITS.NAME.MAX) {
            throw new ValidationError(ERROR.USER.NAME.TOO_LONG(len));
        }

        return new Name(fullName);
    }

    static reconstitute(fullName: string) {
        return new Name(fullName);
    }
}