import ID from "../../../../shared/domain/value-object/Id-object";
import Money from "../../../../shared/domain/value-object/money-object";
import ERROR from "../../../../shared/domain/errors/error.messages";
import Auditable from "../../../../shared/domain/entities/Auditable";
import CartItem from "./cart.item";
import { NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import type ItemObject from "../interfaces/item.object";

export default class Cart extends Auditable {
    private user_id: ID;
    private items: Map<string, CartItem>;

    private constructor(id: ID, user_id: ID, created_at: Date, updated_at: Date, items: Map<string, CartItem>) {
        super(id, created_at, updated_at);
        this.user_id = user_id;
        this.items = items
    }

    has(id: ID): boolean {
        return this.items.has(id.toString());
    }

    getUserId(): ID {
        return this.user_id;
    }

    getItem(productId: ID): CartItem | undefined {
        return this.items.get(productId.toString())?.clone();
    }

    addItem(productId: ID, price: Money) {
        const key = productId.toString();
        const item = this.items.get(key);

        if (item) {
            item.increaseQuantity();
        } else {
            this.items.set(key, CartItem.create(price));
        }

        this.touch();
    }

    removeItem(productId: ID) {
        const key = productId.toString();
        const item = this.items.get(key);

        if (!item) {
            throw new NotFoundError(ERROR.CART.ITEM_NOT_FOUND);
        }

        if (item.getQuantity() === 1) {
            console.log("Item is deleted");
            this.items.delete(key);
        } else {
            console.log("Item is decreased");
            item.decreaseQuantity();
        }

        this.touch();
    }

    getItems(): ReadonlyMap<string, CartItem> {
        const copy = new Map<string, CartItem>();

        this.items.forEach((item, key) => {
            copy.set(key, item.clone());
        });

        return copy;
    }

    calculateTotalCost(): Money {
        let total = Money.reconstitute(0);

        for (const item of this.items.values()) {
            total = total.add(item.getTotal());
        }

        return total;
    }

    count(): number {
        return this.items.size;
    }

    clear() {
        this.items.clear();
    }
    
    isEmpty(): boolean {
        return this.items.size === 0;
    }

    static create(user_id: string): Cart {
        return new Cart(
            ID.generate(),
            ID.create(user_id),
            new Date(),
            new Date(),
            new Map<string, CartItem>()
        )
    }

    static reconstitute(id: string, user_id: string, created_at: Date, updated_at: Date, cartItems: ItemObject[]): Cart {
        const items: Map<string, CartItem> = new Map<string, CartItem>();

        cartItems.forEach(
            item => items.set(item.product_id, CartItem.reconstitute(item.id, item.quantity, item.price))
        )

        const cart = new Cart(
            ID.reconstitute(id),
            ID.reconstitute(user_id),
            created_at,
            updated_at,
            items
        )

        return cart;
    }

    clone(): Cart {
        return new Cart(
            this.getId(),
            this.getUserId(),
            this.getTimestamps().createdAt,
            this.getTimestamps().updatedAt,
            new Map(this.getItems()),
        )
    }
}