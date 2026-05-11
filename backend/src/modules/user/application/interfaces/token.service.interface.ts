export type TPayload = {
    user_id: string,
    role: string,
    iat?: number,
    exp?: number,
}

export default interface ITokenService {
    sign(payload: TPayload): string,
    verify(token: string): TPayload,
}