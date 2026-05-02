import ID from "../value-object/Id-object.ts";

export default abstract class Entity {
    private id!: ID;

    constructor(id: ID) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}