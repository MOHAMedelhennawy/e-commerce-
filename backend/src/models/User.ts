import Auditable from "./Auditable.ts";
import { Cart } from "./Cart.ts";
import { CartItem } from "./CartItem.ts";
import type { Product } from "./Product.ts";

export class User extends Auditable{
    private name: string;
    private email: string;
    private password: string;
    private cart: Cart
    
    constructor(name: string, email: string, password: string, cart: Cart) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.cart = cart;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getEmail(): string{
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setPassword(password: string) {
        this.password = password;
    }

    removeItemFromCart(id: string) {
        this.cart.removeItem(id);
    }
}
