import { Cart } from "./models/Cart";
import { Inventory } from "./models/Inventory";

export function initalizeUserCart(cart: Cart, inventory: Inventory) {
    for(let i = 1; i < 4; i++) {
        const product = inventory.getProduct(`p${i}`);

        if (product)
            cart.addItem(product);
    }
}