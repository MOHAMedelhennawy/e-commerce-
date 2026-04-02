import type { Id } from "../value-objects/Id.js";

export interface IEntity {
    getId(): Id,
}