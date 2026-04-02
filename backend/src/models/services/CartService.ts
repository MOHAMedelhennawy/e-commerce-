import { AppError } from "../../errors/AppError.js";
import { Cart } from "../entities/Cart.js";
import { Inventory } from "../entities/Inventory.js";
import { Product } from "../entities/Product.js";

export class CartService {
    private cart: Cart;
    private inventory: Inventory;

    constructor(cart: Cart, inventory: Inventory) {
        this.cart = cart;
        this.inventory = inventory;
    }

    /**
     * Adds one unit to the cart and withdraws one unit from inventory.
     * Rolls back the cart if inventory withdrawal fails.
     */
    addProductToCart(product: Product): void {
        try {
            this.cart.addItem(product);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Failed to add item to cart", { cause: error });
        }

        const id = product.getId();

        try {
            this.inventory.withdraw(id);
        } catch (error) {
            this.cart.removeItem(id);
            if (error instanceof AppError) throw error;
            throw new Error("Failed to reserve inventory", { cause: error });
        }
    }
}