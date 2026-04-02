import type { Id } from "../../value-objects/Id.js";
import type { IProduct } from "./product.interface.js";

export interface IInventory {
    getProduct(id: Id): IProduct,
    hasProduct(id: Id): boolean,
    addProduct(product: IProduct, quantity: number): void,
    increaseQuantity(id: Id): void,
    withdraw(id: Id): void,
}