import jwt from "jsonwebtoken";
import config from "../../../../config/env"
import type ITokenService from "../../application/interfaces/token.service.interface";
import type { TPayload } from "../../application/interfaces/token.service.interface";
import User from "../../domain/entities/user";

export default class JwtService implements ITokenService {
    private secret: string;

    constructor() {
        this.secret = config.JWT_SECRET;
    }

    sign(user: User): string {
        const payload: TPayload = { user_id: user.getId().toString(), role: user.getRole() };
        return jwt.sign(payload, this.secret, { expiresIn: "1d" });
    }

    verify(token: string): TPayload {
        const decoded = jwt.verify(token, this.secret) as TPayload;
        return decoded;
    }
}