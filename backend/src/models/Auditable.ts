import Entity from "./Entity.ts";

abstract class Auditable extends Entity {
    private createdAt: Date;
    private updatedAt: Date;

    constructor(id?: string) {
        super(id);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    protected touch() {
        this.updatedAt = new Date();
    }
}

export default Auditable;