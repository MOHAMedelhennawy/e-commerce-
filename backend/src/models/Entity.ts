import { v4 as uuidv4 } from 'uuid';

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
}

export default Entity;