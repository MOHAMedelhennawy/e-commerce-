import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import CartItem from "../../domain/entities/cart.item";
import type { CartItemRow, CartWithItemsRow } from "../types/cart.with.items.row";
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";

interface ICartMapper extends IPersistencMapper<Cart, CartWithItemsRow> {
    itemToPersistence(productId: ID, item: CartItem): CartItemRow;
}

export default ICartMapper;