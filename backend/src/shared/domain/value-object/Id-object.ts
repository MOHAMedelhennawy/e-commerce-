import { v4 as uuidv4 } from 'uuid';

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

    static reconstitute(value: string) {
        return new ID(value);
    }
}