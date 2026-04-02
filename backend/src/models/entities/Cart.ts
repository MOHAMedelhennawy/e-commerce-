import Auditable from "../Auditable.js";
import { CartItem } from "./CartItem.js";
import { Product } from "./Product.js";
import { ERRORS } from "../../errors/constants/errors.js";
import { NotFoundError } from "../../errors/domain.errors.js";
import type { Id } from "../value-objects/Id.js";
import type { ICart } from "../interfaces/entities.interfaces/cart.interface.js";
import type { ICartItem } from "../interfaces/entities.interfaces/cartItem.interface.js";
import type { IProduct } from "../interfaces/entities.interfaces/product.interface.js";

export class Cart extends Auditable implements ICart {
    private items: Map<string, ICartItem>;

    constructor() {
        super();
        this.items = new Map();
    }

    /**
     * Retrieves deep copy of cart item, to prevent external mutation of cart items.
     * 
     * @param id product id
     * @returns a clone of the cart item
     */
    getItem(id: Id): ICartItem {
        const item = this.items.get(id.toString());

        if (!item) {
            throw new NotFoundError(ERRORS.CART.ITEM_NOT_FOUND(id));
        }

        return item.clone();
    }

    /**
     * Retrieves deep copy of cart items, to prevent external mutation of cart items.
     * 
     * @returns Array of all cart Items
     */
    getAllItems(): ICartItem[] {
        return Array.from(this.items.values()).map(item => item.clone());
    }

    /**
     * Adds a product to the cart. If the product is already in the cart, increases its quantity by one.
     * 
     * @param product The product to add to the cart.
     * @returns true if the product was newly added, false if the quantity was increased.
     * @throws Error if the product is missing or invalid.
     */
    addItem(product: IProduct): boolean {
        Product.ensureValid(product);
        const id: Id = product.getId();
        const existingItem = this.items.get(id.toString());

        if (existingItem) {
            existingItem.increaseQuantity();
        } else {
            this.items.set(id.toString(), new CartItem(product));
        }

        this.touch();
        return !existingItem;
    }

    /**
     * Method that remove or decrease item
     * 
     * @param id product id
     * @returns true if item removed or decreased successfully, otherwise false
     */
    removeItem(id: Id): boolean {
        const item = this.items.get(id.toString());

        if (!item) {
            throw new NotFoundError(ERRORS.CART.ITEM_NOT_FOUND(id));
        }

        if (item.getQuantity() === 1) {
            this.items.delete(id.toString());
        } else {
            item.decreaseQuantity();
        }

        this.touch();
        return true;
    }

    /**
     * Check if cart has item with a product id
     * 
     * @param id product id
     * @returns true if cart has item wiht product id, otherwise return false
     */
    hasItem(id: Id): boolean {
        return this.items.has(id.toString());
    }

    /**
     * Calculate total cost of all user cart items
     * 
     * @returns Cart total cost
     */
    calculateTotalCost(): number {
       let total = 0;

       for(const item of this.items.values()) {
        total += item.getTotalPrice();
       }

       return total;
    }

    clearCart(): void {
        this.items = new Map();
        this.touch();
    }
}