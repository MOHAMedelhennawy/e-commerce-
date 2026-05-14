import Cart from "../../../cart/domain/entities/cart";
import Product from "../../../product/domain/entities/product";
import Order from "../entities/order";

interface IOrderRepository {
    saveOrder(order: Order, updatedCart: Cart, products: Product[]): Promise<void>
}

export default IOrderRepository;