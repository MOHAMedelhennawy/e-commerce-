import type { Id } from "../../models/value-objects/Id.js";

export const ERRORS = {
    CART: {
        ITEM_NOT_FOUND: (id: Id) => `CartItem ${id.toString()} not found`
    },
    CART_ITEM: {
        INVALID_QUANTITY: "Cart item quantity must be a positive integer",
        DECREASE_AT_MINIMUM:
            "Cannot decrease quantity below one; remove the item from the cart instead.",
    },
    ID: {
        MISSING: "Missing ID",
        INVALID: "Invalid ID"
    },
    PRODUCT: {
        NOT_FOUND: (id: Id) => `Product ${id.toString()} does not exist`,
        OUT_OF_STOCK: (id: Id) =>`Insufficient stock for product '${id.toString()}'`,
        MISSING: "Missing product",
        INVALID: "Invalid product",
        PRICE: "Invalid price",
        TITLE: "Invalid title"
    },
    USER: {
        EMAIL: {
            INVALID: "Invalid user email"
        },
        NAME: {
            INVALID: "Invalid username"
        },
        PASSWORD: {
            INVALID: "Invalid password"
        }
    },
    QUANTITY_BELOW_ZERO: "Quantity cannot be below zero",
    INVALID_QUANTITY: "Invalid or missing quantity",
} as const;