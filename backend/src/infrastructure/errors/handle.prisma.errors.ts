import { AppError } from "../../shared/domain/errors/AppError";
import { Prisma } from "../../../generated/prisma/client";

/**
 * Maps Prisma client errors to {@link AppError}. Returns `undefined` when the
 * value is not a recognized Prisma error (caller should treat as unknown).
 */
const handlePrismaError = (error: unknown): AppError | undefined => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002":
                return new AppError("Duplicate key error.", 409, true);

            case "P2000":
                return new AppError("Input value too long.", 400, true);

            case "P2004":
                return new AppError("Constraint violation.", 400, true);

            case "P2025":
                return new AppError("Record not found.", 404, true);

            default:
                // Unmapped engine codes: treat as non-operational so details stay server-side in prod.
                return new AppError(
                    "Something went wrong, please try again later.",
                    500,
                    false,
                );
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return new AppError("Invalid database request.", 400, true);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return new AppError("Database request failed.", 500, false);
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        return new AppError("Database connection failed.", 500, false);
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        return new AppError("Database engine crashed.", 500, false);
    }

    return undefined;
};

export default handlePrismaError;