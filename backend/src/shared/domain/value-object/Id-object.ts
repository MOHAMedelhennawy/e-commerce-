import { v4 as uuidv4, validate } from 'uuid';
import { ValidationError } from '../errors/domain.errors';
import ERROR from '../errors/error.messages';

export default class ID {
    private value: string

    private constructor(value: string) {
        this.value = value;
    }

    toString() {
        return this.value;
    }

    static generate(): ID {
        return new ID(uuidv4());
    }

    static create(value: string): ID {
        if (!validate(value)) {
            throw new ValidationError(ERROR.ID.INVALID(value));
        }

        return new ID(value);
    }

    static reconstitute(value: string) {
        return new ID(value);
    }
}