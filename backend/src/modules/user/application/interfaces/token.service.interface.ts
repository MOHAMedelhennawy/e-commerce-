import User from "../../domain/entities/user";

export type TPayload = {
    user_id: string,
    role: string,
    iat?: number,
    exp?: number,
}

export default interface ITokenService {
    sign(payload: User): string,
    verify(token: string): TPayload,
}