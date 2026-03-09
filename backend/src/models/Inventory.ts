import { Product } from "./Product.ts";

export class Inventory {
    private products: Map<string, { product: Product, quantity: number}>;

    constructor() {
        this.products = new Map();
    }

    add(product: Product, quantity: number) {
        if (!product || !(product instanceof Product)) {
            throw new Error("Missing Product");
        }

        if (!quantity || quantity < 1) {
            throw new Error("Missing quantity");
        }

        const id = product.getId();
        const newQuantity: number = this.getQuantity(id) + quantity;

        this.products.set(id, { product, quantity: newQuantity });
    }

    increaseQuantity(id: string) {
        this.ensureProductExists(id);

        let currentQuantity: number = this.getQuantity(id);

        this.updateQuantity(id, currentQuantity + 1);
    }

    withdraw(id: string) {
        // Check avialibilty
        this.checkAvailability(id);

        const currentQuantity: number = this.getQuantity(id);

        this.updateQuantity(id, currentQuantity - 1);

    }

    getQuantity(id: string): number {
        return this.products.get(id)?.quantity ?? 0;
    }

    getProduct (id: string): Product | undefined {
        this.ensureProductExists(id);
        return this.products.get(id)?.product;
    }

    private updateQuantity(id: string, newQuantity: number) {
        if (newQuantity < 0)
            throw new Error("Product quantity is missing");

        const product = this.getProduct(id);

        if (product)
            this.products.set(id, { product, quantity: newQuantity });
    }

    private has(id: string) {
        this.checkId(id);
        return this.products.has(id);
    }

    private ensureProductExists(id: string) {
        if (!this.has(id))
            throw new Error("Product not exist");
    }

    private checkAvailability(id: string) {
        // Check if product exist
        this.ensureProductExists(id);

        if (this.getQuantity(id) <= 0) {
            throw new Error("Product out of stock");
        }
    }

    private checkId(id: string) {
        if (typeof id !== "string" || id.trim() === "")
            throw new Error("Missing ID");
    }
}