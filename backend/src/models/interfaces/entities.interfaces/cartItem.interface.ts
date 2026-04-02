import type { IProduct } from "./product.interface.js";

export interface ICartItem {
    getProduct(): IProduct,
    getTotalPrice(): number,
    increaseQuantity(): void,
    decreaseQuantity(): void,
    getQuantity(): number,
    clone(): ICartItem
}