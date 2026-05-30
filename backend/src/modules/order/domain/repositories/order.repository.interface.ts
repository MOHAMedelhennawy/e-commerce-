import Order from "../entities/order";

interface IOrderRepository<TTransaction = unknown> {
    add(order: Order, tx?: TTransaction): Promise<void>
}

export default IOrderRepository;