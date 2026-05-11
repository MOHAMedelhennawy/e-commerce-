import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../entities/cart";

interface ICartRepository {
    getCartWithItems(user_id: ID): Promise<Cart | undefined>;
    saveChanges(cart: Cart): Promise<void>;
}

export default ICartRepository;