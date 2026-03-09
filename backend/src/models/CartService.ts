import { Inventory } from "./Inventory.ts";
import { Cart } from "./Cart.ts";
import { Product } from "./Product.ts";

export class CartService {
    private cart: Cart;
    private inventory: Inventory;

    constructor(cart: Cart, inventory: Inventory) {
        this.cart = cart;
        this.inventory = inventory;
    }

    /**
     * Manage inventory product quantity and cart item quantity
     * @param Product 
     */
    addProductToCart(product: Product) {
        try {
            this.cart.addItem(product);
        } catch (error) {
            throw new Error(`Failed to add item to cart`, { cause: error });
        }

        const id = product.getId();

        try {
            this.inventory.withdraw(id);
        } catch (error) {
            this.cart.removeItem(id);
            throw new Error("Out of stock", { cause: error });
        }
    }
}