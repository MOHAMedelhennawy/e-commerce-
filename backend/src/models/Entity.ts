import { v4 as uuidv4 } from 'uuid';
import { ERRORS } from '../constants/errors';

abstract class Entity {
    private id: string;

    constructor(id?: string) {
        this.id = id ? id : uuidv4();
    }

    getId(): string {
        return this.id;
    }

    sameId(id: string): boolean {
        return this.id === id;
    }

    protected checkId(id: string) {
        if (typeof id !== "string")
            throw new Error(ERRORS.INVALID_ID);

        if (id.trim() === "")
            throw new Error(ERRORS.MISSING_ID);
    }
}

export default Entity;