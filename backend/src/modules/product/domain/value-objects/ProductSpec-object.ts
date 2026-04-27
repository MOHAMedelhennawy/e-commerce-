import { ValidationError } from "../../../../shared/domain/errors/domain.errors.ts";
import Money from "../../../../shared/domain/value-object/Money-object.ts";

export default class ProductSpec {
    private title!: string;
    private price: Money;
    private stock!: number;

    constructor(title: string, price: number, stock: number) {
        this.title = this.validateTitle(title);
        this.price = new Money(price);
        this.stock = this.validateStock(stock);
    }

    // getters
    getTitle(): string { return this.title; }
    getPrice(): number { return this.price.getAmount(); }
    getStock(): number { return this.stock; }

    // setters
    setTitle(title: string): void {
        this.validateTitle(title);
        this.title = title;
    }

    setStock(stock: number): void {
        this.validateStock(stock);
        this.stock = stock;
    }

    setPrice(price: number): void { this.price.setAmount(price); }

    updateInformation(title?: string, price?: number, stock?: number) {
        if (title !== undefined) this.setTitle(title);
        if (price !== undefined) this.setPrice(price);
        if (stock !== undefined) this.setStock(stock);
    }

    private validateTitle(title: string): string {
        if (!title || typeof title !== 'string') {
            throw new ValidationError("Invalid product title");
        }

        return title;
    }

    private validateStock(stock: number): number {
        if (stock < 0) {
            throw new ValidationError("Stock must be greater than 0");
        }

        return stock;
    }
}