import { validate as isValidUUID } from "uuid"
import { ValidationError } from "../../errors/domain.errors.js"
import { ERRORS } from "../../errors/constants/errors.js"

export class Id {
    constructor(public readonly value: string) {
        if (!isValidUUID(value))
            throw new ValidationError(ERRORS.ID.INVALID);
    }

    public same(other: Id): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}