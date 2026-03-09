import { initalizeInventory } from "./initlizeInventory.ts";
import { Inventory } from "./models/Inventory.ts";
import { Cart } from "./models/Cart.ts";
import { User } from "./models/User.ts";
import { CartItem } from "./models/CartItem.ts";
import { Product } from "./models/Product.ts";
import { CartService } from "./models/CartService.ts";

const inventory = new Inventory();

initalizeInventory(inventory);

const cart = new Cart();
const user = new User("Mohammed", "Elhennawy@gmail.com", "234oi", cart);
console.log("User created and has a cart...");

const cartService: CartService = new CartService(cart, inventory);

const product: Product | undefined = inventory.getProduct("p2");

if (product) {
    cartService.addProductToCart(product)
    cartService.addProductToCart(product)
    cartService.addProductToCart(product)
    cartService.addProductToCart(product)
    cartService.addProductToCart(product)
}

console.log(cart);