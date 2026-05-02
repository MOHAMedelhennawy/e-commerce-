import Auditable from "../../../../shared/domain/entities/Auditable.ts";
import ID from "../../../../shared/domain/value-object/Id-object.ts";
import Money from "../value-objects/money-object.ts";
import Stock from "../value-objects/stock.object.ts";
import Title from "../value-objects/title.object.ts";

export default class Product extends Auditable {
    private title: Title;
    private price: Money;
    private stock: Stock;

    private constructor(id: string, title: Title, price: Money, stock: Stock, created_at: Date, updated_at: Date) {
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

    updateProduct(title?: string, price?: number, stock?: number) {
        if (title) this.setTitle(title);
        if (price) this.setPrice(price);
        if (stock) this.setStock(stock);
        this.touch();
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
            id,
            Title.reconstitute(title),
            Money.reconstitute(price),
            Stock.reconstitute(stock),
            created_at,
            updated_at
        )
    }
}