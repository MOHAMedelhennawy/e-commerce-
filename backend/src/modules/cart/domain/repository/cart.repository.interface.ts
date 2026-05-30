import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../entities/cart";

interface ICartRepository<TTransaction = unknown> {
    getCartWithItems(user_id: ID): Promise<Cart | undefined>;
    save(updatedCart: Cart, tx?: TTransaction): Promise<void>;
}

export default ICartRepository;