import { Decimal } from "@prisma/client/runtime/client";

export type CartItemRow = {
    id: string,
    // cart_id: string,
    product_id: string,
    quantity: number,
    price: Decimal,
}

export type CartWithItemsRow = {
    id: string,
    user_id: string,
    cart_items: CartItemRow[],
    created_at: Date,
    updated_at: Date,
}
