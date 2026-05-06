import * as z from "zod";

const LoginUserSchema = z.object({
    email: z.string().nonempty({ message: "Email field is required" }),
    password: z.string().nonempty({ message: "Password field is required" }),
});

export default LoginUserSchema;