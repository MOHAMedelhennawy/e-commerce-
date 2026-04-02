import Entity from "./Entity.ts";
import type { Id } from "./value-objects/Id.ts";

abstract class Auditable extends Entity {
    private createdAt: Date;
    private updatedAt: Date;

    constructor(id?: Id) {
        super(id);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    protected touch() {
        this.updatedAt = new Date();
    }
}

export default Auditable;