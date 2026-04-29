import bcrypt from "bcrypt";
import IPasswordHasher from "../../../user/domain/interfaces/password.hasher.interface";

export default class BcryptPasswordHasher implements IPasswordHasher {
    private plainPassword: string;
    private saltRounds: number = 10;

    constructor(plainPassword: string) {
        this.plainPassword = plainPassword;
    }

    async hash(): Promise<string> {
        return await bcrypt.hash(this.plainPassword, this.saltRounds);
    }
}