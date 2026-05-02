import ID from "../value-object/Id-object.ts";
import Entity from "./Entity.ts";

export default class Auditable extends Entity{
    private createdAt: Date;
    private updatedAt: Date;

    constructor(id: ID, createdAt: Date, updatedAt: Date) {
        super(id);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getTimestamps() {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    protected touch() {
        this.updatedAt = new Date();
    }
}