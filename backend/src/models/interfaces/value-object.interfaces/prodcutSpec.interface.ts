export interface IProductSpec {
    getTitle(): string,
    setTitle(title: string): void,
    getPrice(): number,
    setPrice(price: number): void
}