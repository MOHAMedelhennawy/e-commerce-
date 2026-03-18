import { ERRORS } from "../constants/errors";
import { Product } from "./Product.ts";

export class Inventory {
    private products: Map<string, { product: Product, quantity: number}>;

    constructor() {
        this.products = new Map();
    }

    add(product: Product, quantity: number) {
        if (!product) {
            throw new Error(ERRORS.MISSING_PRODUCT);
        }

        if (!(product instanceof Product)) {
            throw new Error(ERRORS.INVALID_PRODUCT);
        }

        // Rejects NaN, Infinity, and -Infinity since they are not valid quantities
        // typeof NaN === "number" => true, so you can't check useing typeof x === "number", because
        // NaN value will accepted
        if (!Number.isFinite(quantity)) {
            throw new Error(ERRORS.INVALID_QUANTITY);
        }

        if (quantity < 0) {
            throw new Error(ERRORS.QUANTITY_BELOW_ZERO);
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
        this.checkId(id)
        return this.products.get(id)?.quantity ?? 0;
    }

    getProduct (id: string): Product | undefined {
        this.ensureProductExists(id);
        return this.products.get(id)?.product;
    }

    private updateQuantity(id: string, newQuantity: number) {
        if (newQuantity < 0)
            throw new Error(ERRORS.INVALID_QUANTITY);

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
            throw new Error(ERRORS.PRODUCT_NOT_FOUND);
    }

    private checkAvailability(id: string) {
        // Check if product exist
        this.ensureProductExists(id);

        if (this.getQuantity(id) <= 0) {
            throw new Error(ERRORS.PRODUCT_OUT_OF_STOCK);
        }
    }

    private checkId(id: string) {
        if (typeof id !== "string")
            throw new Error(ERRORS.INVALID_ID);

        if (id.trim() === "")
            throw new Error(ERRORS.MISSING_ID);
    }
}