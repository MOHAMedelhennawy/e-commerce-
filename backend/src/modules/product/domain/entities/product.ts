import ID from "../../../../shared/domain/value-object/Id-object";
import Money from "../../../../shared/domain/value-object/money-object";
import Title from "../value-objects/title.object";
import Auditable from "../../../../shared/domain/entities/Auditable";
import Stock from "../../../../shared/domain/value-object/stock.object";

export default class Product extends Auditable {
    private title: Title;
    private price: Money;
    private stock: Stock;

    private constructor(id: ID, title: Title, price: Money, stock: Stock, created_at: Date, updated_at: Date) {
        super(id, created_at, updated_at)
        this.title = title;
        this.price = price;
        this.stock = stock;
    }

    // Getters
    getTitle(): Title { return this.title; }
    getPrice(): Money { return this.price; }
    getStock(): Stock { return this.stock; }

    // Setters
    setTitle(title: string) { this.title = Title.create(title) };
    setPrice(price: number) { this.price = Money.create(price) };
    setStock(stock: number) { this.stock = Stock.create(stock) };

    updateProduct(title?: Title, price?: Money, stock?: Stock) {
        if (title !== undefined) this.title = title;
        if (price !== undefined) this.price = price;
        if (stock !== undefined) this.stock = stock;
        this.touch();
    }

    isAvailable(): boolean {
        return this.stock.isAvialable()
    }

    // Factories
    /**
     * Create new product to validate input data, to be ready to store in database
     * 
     * @param title 
     * @param price 
     * @param stock 
     * 
     * @returns new product, or throw validation error
     */
    static create(title: string, price: number, stock: number): Product {
        return new Product(
            ID.generate(),
            Title.create(title),
            Money.create(price),
            Stock.create(stock),
            new Date(),
            new Date(),
        )
    }

    static reconstitute(id: string, title: string, price: number, stock: number, created_at: Date, updated_at: Date) {
        return new Product(
            ID.reconstitute(id),
            Title.reconstitute(title),
            Money.reconstitute(price),
            Stock.reconstitute(stock),
            created_at,
            updated_at
        )
    }
}