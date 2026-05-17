import { type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

type ValidationTarget = "body" | "params";

const validate = (schema: ZodSchema, target: ValidationTarget = "body") => (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = target === "params" ? req.params : req.body;
        schema.parse(data);
        next();
    } catch (error) {
        next(error);
    }
};

export default validate;