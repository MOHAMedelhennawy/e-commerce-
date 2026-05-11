import jwt from "jsonwebtoken";
import config from "../../../../config/env"
import type ITokenService from "../../application/interfaces/token.service.interface";
import type { TPayload } from "../../application/interfaces/token.service.interface";

export default class JwtService implements ITokenService {
    private secret: string;

    constructor() {
        this.secret = config.JWT_SECRET;
    }

    sign(payload: TPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: "1d" });
    }

    verify(token: string): TPayload {
        const decoded = jwt.verify(token, this.secret) as TPayload;
        return decoded;
    }
}