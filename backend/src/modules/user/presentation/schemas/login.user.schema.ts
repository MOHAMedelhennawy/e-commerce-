import * as z from "zod";
import ERROR from "../../../../shared/domain/errors/error.messages";

const LoginUserSchema = z.object({
    email: z.string().email({ message: ERROR.USER.EMAIL.INVALID }),
    password: z.string().min(1, { message: "Password is required" }),
});

export default LoginUserSchema;