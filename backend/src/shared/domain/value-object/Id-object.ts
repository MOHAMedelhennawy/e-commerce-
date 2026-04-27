import { validate as isValid, v4 as uuidv4 } from 'uuid';
import { ValidationError } from "../errors/domain.errors";
import ERROR from '../../errors/error.messages';

export default class ID {
    private value: string

    constructor(value: string) {
        this.value = this.assignID(value);
    }

    toString() {
        return this.value;
    }

    private assignID(value: string): string {
        if (value === undefined) {
            throw new ValidationError(ERROR.ID.MISSING);
        }

        if (!isValid(value)) {
            throw new ValidationError(ERROR.ID.INVALID(value));
        }   

        return value;
    }

    static validate(id: string) {
        if (id === undefined) {
            throw new ValidationError(ERROR.ID.MISSING);
        }

        if (!isValid(id)) {
            throw new ValidationError(ERROR.ID.INVALID(id));
        }   
    }

    static generate() {
        return uuidv4();
    }
}