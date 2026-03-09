import { Product } from "./Product.ts";

export class CartItem {
    private product: Product;
    private quantity: number;

    constructor(product: Product, quantity?: number) {
        this.product = product;
        this.quantity = quantity ?? 1;
    }

    getProduct(): Product {
        return this.product;
    }

    getTotalPrice(): number {
        return this.product.getSpec().getPrice() * this.quantity;
    }

    increaseQuantity() {
        this.quantity += 1;
    }

    decreaseQuantity() {
        if (this.quantity <= 0)
            throw new Error("Cannot decrease quantity below zero.");

        this.quantity -= 1;
    }

    getQuantity() {
        return this.quantity;
    }

    clone(): CartItem {
        const cloned = new CartItem(this.product, this.quantity);

        return cloned;
    }
}