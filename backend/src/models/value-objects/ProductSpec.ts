export class ProductSpec {
    private title: string;
    private price: number;

    constructor(title: string, price: number, /** category */) {
        this.title = title;
        this.price = price;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    getPrice(): number {
        return this.price;
    }

    setPrice(price: number): void {
        this.price = price;
    }
}