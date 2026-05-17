import Entity from "../../../../shared/domain/entities/Entity";
import ID from "../../../../shared/domain/value-object/Id-object";
import Money from "../../../../shared/domain/value-object/money-object";

export default class CartItem extends Entity {
    private quantity: number;
    private price: Money;

    private constructor(id: ID, quantity: number, price: Money) {
        super(id);
        this.quantity = quantity;
        this.price = price;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getPrice(): Money {
        return this.price;
    }

    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        this.quantity--;
    }

    getTotal(): Money {
        return this.price.multiply(this.quantity);
    }

    clone(): CartItem {
        return new CartItem(
            this.getId(),
            this.quantity,
            this.price
        )
    }

    static create(price: Money): CartItem {
        return new CartItem(
            ID.generate(),
            1,
            price,
        )
    }

    static reconstitute(id: string, quantity: number, price: number): CartItem {
        return new CartItem(
            ID.reconstitute(id),
            quantity,
            Money.reconstitute(price),
        )
    }
}