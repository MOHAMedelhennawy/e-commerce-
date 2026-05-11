import Cart from "../../domain/entities/cart";
import type { CartWithItemsRow } from "../types/cart.with.items.row";
import type { CartItemRow } from "../types/cart.with.items.row";
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";

export default class CartMappre implements IPersistencMapper<Cart, CartWithItemsRow>{
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
            cart_items: this.itemsToPersistence(cart),
            created_at: cart.getTimestamps().createdAt,
            updated_at: cart.getTimestamps().updatedAt
        }
    }

    itemsToPersistence(cart: Cart): CartItemRow[] {
        let itemsObject: CartItemRow[] = [];

        cart.getItems().forEach(
            (value, key) => {
                itemsObject.push({
                    id: value.getId().toString(),
                    product_id: key.toString(),
                    quantity: value.getQuantity(),
                    price: value.getPrice().toDecimal(),
                })
            }
        )
        return itemsObject;
    }
}