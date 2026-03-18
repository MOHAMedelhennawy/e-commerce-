import { ERRORS } from "../constants/errors.ts";
import Auditable from "./Auditable.ts";
import { CartItem } from "./CartItem.ts";
import { Product } from "./Product.ts";

export class Cart extends Auditable{
    private items: Map<string, CartItem>;

    constructor() {
        super();
        this.items = new Map();
    }

    /**
     * Retrieves deep copy of cart item, to prevent external mutation of cart items.
     * 
     * @param id product id
     * @returns item Object if found, otherwise null
     */
    getItem(id: string): CartItem | null {
        if(!this.hasItem(id))
            return null;

        return this.items.get(id)?.clone() ?? null;
    }

    /**
     * Retrieves deep copy of cart items, to prevent external mutation of cart items.
     * 
     * @returns Array of all cart Items
     */
    getAllItems(): CartItem[] {
        return Array.from(this.items.values()).map(item => item.clone());
    }

    /**
     * Adds a product to the cart. If the product is already in the cart, increases its quantity by one.
     * 
     * @param product The product to add to the cart.
     * @returns true if the product was newly added, false if the quantity was increased.
     * @throws Error if the product is missing or invalid.
     */
    addItem(product: Product): boolean {
        if (!product) {
            throw new Error(ERRORS.MISSING_PRODUCT);
        }

        if (!(product instanceof Product)) {
            throw new Error(ERRORS.INVALID_PRODUCT);
        }

        const id = product.getId();
        const existingItem = this.items.get(id);

        if (existingItem) {
            existingItem.increaseQuantity();
            return false; // quantity increased
        } else {
            this.items.set(id, new CartItem(product));
            return true; // product added
        }
    }


    /**
     * Method that remove or decrease item
     * 
     * @param id product id
     * @returns true if item removed or decreased successfully, otherwise false
     */
    removeItem(id: string): boolean {
        this.checkId(id);

        if (!this.items.has(id)) {
            throw new Error(ERRORS.PRODUCT_NOT_FOUND);
        }

        const item: CartItem | undefined = this.items.get(id);

        if (item?.getQuantity() === 1) {
            this.items.delete(id);
        } else {
            item?.decreaseQuantity();
        }

        return true;
    }

    /**
     * Check if cart has item with a product id
     * 
     * @param id product id
     * @returns true if cart has item wiht product id, otherwise return false
     */
    private hasItem(id: string): boolean {
        this.checkId(id);
        return this.items.has(id);
    }

    /**
     * Retrieves the cart item for the specified product id.
     * 
     * @param id - The id of the product.
     * @returns The CartItem object if it exists, otherwise null.
     */

    private getItemInternal(id: string): CartItem | null {
        if(!this.hasItem(id))
            return null;

        return this.items.get(id)?.clone() ?? null;
    }

    /**
     * Calculate total cost of all user cart items
     * 
     * @returns Cart total cost
     */
    calculateTotalCost(): number {
        return Array.from(this.items.values())
            .reduce((sum, item) => sum + item.getTotalPrice(), 0);
    }

    protected clearCart() {
        this.items = new Map();
    }
}