import ID from "../value-object/Id-object.ts";

export default abstract class Entity {
    private id!: ID;

    constructor(id: string) {
        this.id = new ID(id);
    }

    getId() {
        return this.id.toString();
    }

}