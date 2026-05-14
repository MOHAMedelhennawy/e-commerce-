import ID from "../../../../shared/domain/value-object/Id-object";
import Money from "../../../../shared/domain/value-object/money-object";

export interface IProductQuery {
    findUnique(id: ID): Promise<ProductQueryResult | undefined>;
}

export interface ProductQueryResult {
    getPrice(): Money,
    isAvailable(): boolean,
}

