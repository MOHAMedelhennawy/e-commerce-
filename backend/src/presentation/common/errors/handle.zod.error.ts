import * as z from "zod"; 
import BadRequestError from "./bad.request.error";

export default function handleZodError(err: unknown): BadRequestError | undefined {
    if (err instanceof z.ZodError) {
        let errors: Record<string, string> = {};

        if (err.issues[0].path.length === 0) {
            errors['id'] = err.issues[0].message
        } else {
            err.issues.map(
                error => {
                    errors[error.path[0]?.toString()] = error.message;
                }
            )
        }

        return new BadRequestError(errors);
    }

    return undefined;
}