import Auditable from "../../../../shared/domain/entities/Auditable.ts";
import Money from "../value-objects/money-object.ts";
import Stock from "../value-objects/stock.object.ts";
import Title from "../value-objects/title.object.ts";

export default class Product extends Auditable {
    private title: Title;
    private price: Money;
    private stock: Stock;

    constructor(id: string, title: string, price: number, stock: number, created_at: Date, updated_at: Date) {
        super(id, created_at, updated_at)
        this.title = Title.create(title);
        this.price = Money.create(price);
        this.stock = Stock.create(stock);
    }

    getTitle(): Title { return this.title; }
    getPrice(): Money { return this.price; }
    getStock(): Stock { return this.stock; }

    setTitle(title: string) { this.title = Title.create(title) };
    setPrice(price: number) { this.price = Money.create(price) };
    setStock(stock: number) { this.stock = Stock.create(stock) };

    updateProduct(title?: string, price?: number, stock?: number) {
        if (title) this.setTitle(title);
        if (price) this.setPrice(price);
        if (stock) this.setStock(stock);
        this.touch();
    }
}