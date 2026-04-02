import type { IEntity } from "../entity.interface.js";
import type { IProductSpec } from "../value-object.interfaces/prodcutSpec.interface.js";

export interface IProduct extends IEntity{
    getSpec(): IProductSpec,
    setPrice(price: number): void,
    setTitle(title: string): void,
}