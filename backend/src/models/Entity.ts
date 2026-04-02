import { v4 as uuidv4 } from 'uuid';
import { Id } from './value-objects/Id.js';
import type { IEntity } from './interfaces/entity.interface.js';

abstract class Entity implements IEntity {
    private readonly _id: Id;

    constructor(id?: Id) {
        this._id = id ?? new Id(uuidv4());
    }

    getId(): Id {
        return this._id;
    }

    protected equals(other: Entity): boolean {
        return this._id.same(other._id);
    }
}

export default Entity;