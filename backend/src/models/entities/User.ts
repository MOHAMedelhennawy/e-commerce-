import { ERRORS } from "../../errors/constants/errors.js";
import { ValidationError } from "../../errors/domain.errors.js";
import Auditable from "../Auditable.js";
import type { ICart } from "../interfaces/entities.interfaces/cart.interface.js";
import type { IUser } from "../interfaces/entities.interfaces/user.interface.js";
import { Cart } from "./Cart.js";

export class User extends Auditable implements IUser {
    private name!: string;
    private email!: string;
    private password!: string;
    private cart!: Cart;

    constructor(name: string, email: string, password: string) {
        super();
        this.assignName(name);
        this.assignEmail(email);
        this.assignPassword(password);
        this.cart = new Cart();
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.assignName(name);
        this.touch();
    }

    getEmail(): string {
        return this.email;
    }

    getCart(): ICart {
        return this.cart;
    }

    setEmail(email: string) {
        this.assignEmail(email);
        this.touch();
    }

    setPassword(password: string) {
        this.assignPassword(password);
        this.touch();
    }

    private assignName(name: string) {
        if (!name || typeof name !== "string") {
            throw new ValidationError(ERRORS.USER.NAME.INVALID);
        }
        this.name = name;
    }

    private assignEmail(email: string) {
        if (!email || typeof email !== "string") {
            throw new ValidationError(ERRORS.USER.EMAIL.INVALID);
        }
        this.email = email;
    }

    private assignPassword(password: string) {
        if (!password || typeof password !== "string" || password.length < 8) {
            throw new ValidationError(ERRORS.USER.PASSWORD.INVALID);
        }
        this.password = password;
    }
}
