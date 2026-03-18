import Auditable from "./Auditable.ts";
import { Cart } from "./Cart.ts";

export class User extends Auditable{
    private name: string;
    private email: string;
    private password: string;
    private cart: Cart
    
    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.cart = new Cart();
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        if (!name || typeof name !== "string")
            throw new Error("Invalid user name");
        this.name = name;
    }

    getEmail(): string{
        return this.email;
    }

    getCart(): Cart {
        return this.cart;
    }

    setEmail(email: string) {
        if (!email)
            throw new Error("Invalid user email");

        this.email = email;
    }

    setPassword(password: string) {
        this.password = password;
    }
}
