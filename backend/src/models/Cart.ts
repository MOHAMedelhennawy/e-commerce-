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
     * Method to get item by product id
     * 
     * @param id product id
     * @returns item Object if found, otherwise null
     */
    getItem(id: string): CartItem | null {
        if(!this.hasItem(id))
            return null;

        return this.items.get(id) ?? null;
    }

    /**
     * Get deep copy of cart items, to prevent external mutation of cart items.
     * 
     * @returns Array of all cart Items
     */
    getItems(): CartItem[] {
        return Array.from(this.items.values()).map(item => item.clone());
    }

    /**
     * Method that add new item to user cart items
     * 
     * @param item New item that will added to user cart items
     * @returns true if item added successfully, otherwise return false
     */
    addItem(product: Product) {
        if (!product || !(product instanceof Product)) {
            throw new Error("Missing Product");
        }

        const id = product.getId();

        const item = this.getItem(id);

        if (item) {
            item.increaseQuantity();
        } else {
            this.items.set(id, new CartItem(product));
        }
    }


    /**
     * Method that remove or decrease item
     * 
     * @param id product id
     * @returns true if item removed or decreased successfully, otherwise false
     */
    removeItem(id: string): boolean {
        if (!this.items.has(id)) {
            return false;
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

    private checkId(id: string) {
        if (typeof id !== "string" || id.trim() === "")
            throw new Error("Missing ID");
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