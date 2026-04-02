import { ERRORS } from "../../errors/constants/errors.js";
import { ValidationError } from "../../errors/domain.errors.js";
import type { ICartItem } from "../interfaces/entities.interfaces/cartItem.interface.js";
import type { IProduct } from "../interfaces/entities.interfaces/product.interface.js";

export class CartItem implements ICartItem{
    private product: IProduct;
    private quantity: number;

    constructor(product: IProduct, quantity?: number) {
        this.product = product;
        const q = quantity ?? 1;
        if (!Number.isInteger(q) || q < 1 || !Number.isFinite(q)) {
            throw new ValidationError(ERRORS.CART_ITEM.INVALID_QUANTITY);
        }
        this.quantity = q;
    }

    getProduct(): IProduct {
        return this.product;
    }

    getTotalPrice(): number {
        return this.product.getSpec().getPrice() * this.quantity;
    }

    increaseQuantity(): void {
        this.quantity += 1;
    }

    decreaseQuantity(): void {
        if (this.quantity <= 1) {
            throw new ValidationError(ERRORS.CART_ITEM.DECREASE_AT_MINIMUM);
        }

        this.quantity -= 1;
    }

    getQuantity(): number {
        return this.quantity;
    }

    clone(): ICartItem {
        return new CartItem(this.product, this.quantity);
    }
}