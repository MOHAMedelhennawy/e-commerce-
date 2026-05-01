import { type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
};

export default validate;