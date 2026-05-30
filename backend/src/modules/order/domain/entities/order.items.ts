import ID from "../../../../shared/domain/value-object/Id-object";
import Money from "../../../../shared/domain/value-object/money-object";

export default class OrderItem {
    constructor(
        private price: Money,
        private quantity: number,
        private productId: ID
    ) {}

    getTotal(): Money {
        return this.price.multiply(this.quantity);
    }
    
    static create(price: Money, quantity: number, productId: ID): OrderItem {
        return new OrderItem(
            price,
            quantity,
            productId
        )
    }
}