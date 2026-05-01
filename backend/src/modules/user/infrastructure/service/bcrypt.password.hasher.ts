import type IPasswordHasher from "../../application/interfaces/password.hasher.interface";

export default class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }

    async hash(password: string): Promise<string> {
        if (typeof password !== "string" || password.length === 0) {
            throw new Error("Password must be a non-empty string");
        }

        try {
            const bcrypt = (await import("bcrypt")).default;
            const salt = await bcrypt.genSalt(this.saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw new Error(
                `Failed to hash password: ${err instanceof Error ? err.message : String(err)}`
            );
        }
    }
    
}