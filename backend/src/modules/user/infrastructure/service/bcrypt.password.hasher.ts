import bcrypt from "bcryptjs";
import type IPasswordHasher from "../../application/interfaces/password.hasher.interface";
import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import { AppError } from "../../../../shared/domain/errors/AppError";

export default class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }

    async hash(password: string): Promise<string> {
        if (typeof password !== "string" || password.length === 0) {
            throw new ValidationError("Password must be a non-empty string");
        }

        try {
            const salt = await bcrypt.genSalt(this.saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw new AppError(
                `Failed to hash password: ${err instanceof Error ? err.message : String(err)}`,
                500,
                false,
            );
        }
    }
    
    async verify(passowrd: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(passowrd, hash);
        return isMatch;
    }
}