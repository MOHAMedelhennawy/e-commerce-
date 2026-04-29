import * as z from "zod";

const RegisterUserSchema = z.object({
    name: z.string().nonempty({ message: "Name field is required" }),
    email: z.string().nonempty({ message: "Email field is required" }),
    password: z.string().nonempty({ message: "Password field is required" }),
});

export default RegisterUserSchema;