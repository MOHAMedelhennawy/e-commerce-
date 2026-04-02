import type { IEntity } from "../entity.interface.js";
import type { ICart } from "./cart.interface.js";

export interface IUser extends IEntity{
    getName(): string,
    setName(name: string): void,
    getEmail(): string,
    setEmail(email: string): void,
    getCart(): ICart,
    setPassword(password: string): void,
}