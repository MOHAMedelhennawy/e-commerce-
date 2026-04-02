import type { Id } from "../../value-objects/Id.js";
import type { IEntity } from "../entity.interface.js";
import type { ICartItem } from "./cartItem.interface.js";
import type { IProduct } from "./product.interface.js";

export interface ICart extends IEntity {
    getItem(id: Id): ICartItem,
    getAllItems(): ICartItem[],
    addItem(product: IProduct): boolean,
    removeItem(id: Id): boolean,
    hasItem(id: Id): boolean,
    calculateTotalCost(): number,
    clearCart(): void
};