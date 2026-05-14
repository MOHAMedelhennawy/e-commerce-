import ID from "../../../../shared/domain/value-object/Id-object";
import Auditable from "../../../../shared/domain/entities/Auditable";
import OrderItem from "./order.items";
import Money from "../../../../shared/domain/value-object/money-object"

export default class Order extends Auditable {
    private constructor(
        id: ID,
        private user_id: ID,
        private items: OrderItem[],
        private totalCost: Money,
        created_at: Date,
        updated_at: Date,
    ) {
        super(id, created_at, updated_at)
    }

    static create(userId: ID, items: OrderItem[]): Order {
        let totalCost = Money.reconstitute(0);

        for (let item of items) {
            totalCost = totalCost.add(item.getTotal())
        }

        return new Order(
            ID.generate(),
            userId,
            items,
            totalCost,
            new Date(),
            new Date(),
        )
    }
}