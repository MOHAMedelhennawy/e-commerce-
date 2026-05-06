declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: string;
                iat?: number;
                exp?: number;
            }
        }
    }
}

export {};