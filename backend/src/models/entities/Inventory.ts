import { ERRORS } from "../../errors/constants/errors.js";
import {
    InsufficientStockError,
    NotFoundError,
    ValidationError,
} from "../../errors/domain.errors.js";
import { Product } from "./Product.js";
import type { IInventory } from "../interfaces/entities.interfaces/inventory.interface.js";
import type { IProduct } from "../interfaces/entities.interfaces/product.interface.js";
import type { Id } from "../value-objects/Id.js";

export class Inventory implements IInventory {
    private products: Map<string, { product: IProduct, quantity: number}>;

    constructor() {
        this.products = new Map();
    }

    addProduct(product: IProduct, quantity: number) {
        Product.ensureValid(product);
        this.ensureValidQuantity(quantity);

        const id: Id = product.getId();
        const newQuantity: number = this.getQuantity(id) + quantity;
        this.products.set(id.toString(), { product, quantity: newQuantity });
    }

    getProduct (id: Id): IProduct {
        const product = this.getEntry(id)?.product;

        if (!product)
            throw new NotFoundError(ERRORS.PRODUCT.NOT_FOUND(id));

        return product;
    }

    hasProduct(id: Id): boolean {
        return this.products.has(id.toString());
    }

    increaseQuantity(id: Id): void {
        this.ensureProductExists(id);
        this.updateQuantity(id, this.getQuantity(id) + 1);
    }

    withdraw(id: Id): void {
        // Check avialibilty
        this.checkAvailability(id);
        this.updateQuantity(id, this.getQuantity(id) - 1);
    }

    getQuantity(id: Id): number {
        return this.products.get(id.toString())?.quantity ?? 0;
    }

    private updateQuantity(id: Id, newQuantity: number) {
        const entry = this.getEntry(id);

        if (!entry) {
            throw new NotFoundError(ERRORS.PRODUCT.NOT_FOUND(id));
        }

        if (newQuantity < 0)
            throw new ValidationError(ERRORS.QUANTITY_BELOW_ZERO);

        entry.quantity = newQuantity;
    }


    private ensureProductExists(id: Id) {
        if (!this.hasProduct(id)) throw new NotFoundError(ERRORS.PRODUCT.NOT_FOUND(id));
    }

    private ensureValidQuantity(quantity: number) {
        // Rejects NaN, Infinity, and -Infinity since they are not valid quantities
        // typeof NaN === "number" => true, so you can't check useing typeof x === "number", because
        // NaN value will accepted
        if (!Number.isFinite(quantity)) {
            throw new ValidationError(ERRORS.INVALID_QUANTITY);
        }

        if (quantity < 0) {
            throw new ValidationError(ERRORS.QUANTITY_BELOW_ZERO);
        }
    }

    private getEntry (id: Id) {
        return this.products.get(id.toString());
    }

    private checkAvailability(id: Id) {
        // Check if product exist
        this.ensureProductExists(id);

        if (this.getQuantity(id) <= 0) {
            throw new InsufficientStockError(ERRORS.PRODUCT.OUT_OF_STOCK(id));
        }
    }
}