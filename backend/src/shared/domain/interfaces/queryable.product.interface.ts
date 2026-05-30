import ID from "../value-object/Id-object";
import Money from "../value-object/money-object";

export interface IQueryableProduct {
    findUnique(id: ID): Promise<QuerableProductResult | undefined>;
}

export interface QuerableProductResult {
    getPrice(): Money
    isAvailable(): boolean
}