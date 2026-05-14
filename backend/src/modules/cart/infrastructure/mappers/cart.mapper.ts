import Cart from "../../domain/entities/cart";
import type { CartWithItemsRow } from "../types/cart.with.items.row";
import type { CartItemRow } from "../types/cart.with.items.row";
import type ICartMapper from "../interfaces/cart.mapper.interface";
import ID from "../../../../shared/domain/value-object/Id-object";
import CartItem from "../../domain/entities/cart.item";

export default class CartMapper implements ICartMapper {
    toDomain(row: CartWithItemsRow): Cart {
        const cart = Cart.reconstitute(
            row.id,
            row.user_id,
            row.created_at,
            row.updated_at,
            row.cart_items.map(item => ({
                ...item,
                price: item.price.toNumber(),
            }))
        );

        return cart;
    }

    toPersistence(cart: Cart): CartWithItemsRow {
        return {
            id: cart.getId().toString(),
            user_id: cart.getUserId().toString(),
            cart_items: this.itemsRowsFromCart(cart),
            created_at: cart.getTimestamps().createdAt,
            updated_at: cart.getTimestamps().updatedAt
        }
    }

    itemToPersistence(productId: ID, item: CartItem): CartItemRow {
        return {
            id: item.getId().toString(),
            product_id: productId.toString(),
            quantity: item.getQuantity(),
            price: item.getPrice().toDecimal(),
        }
    }

    private itemsRowsFromCart(cart: Cart): CartItemRow[] {
        return Array.from(cart.getItems().entries()).map(
            ([key, value]) => this.itemToPersistence(ID.reconstitute(key), value)
        );
    }
}