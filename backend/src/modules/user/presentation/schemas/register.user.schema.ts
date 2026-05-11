import * as z from "zod";
import { USER_LIMITS } from "../../../../shared/domain/constants/domain.constants";
import ERROR from "../../../../shared/domain/errors/error.messages";

const RegisterUserSchema = z.object({
    name: z.string()
        .min(USER_LIMITS.NAME.MIN, { message: ERROR.USER.NAME.TOO_SHORT(USER_LIMITS.NAME.MIN) })
        .max(USER_LIMITS.NAME.MAX, { message: ERROR.USER.NAME.TOO_LONG(USER_LIMITS.NAME.MAX) }),
    email: z.string()
        .min(USER_LIMITS.EMAIL.MIN, { message: ERROR.USER.EMAIL.TOO_SHORT(USER_LIMITS.EMAIL.MIN) })
        .max(USER_LIMITS.EMAIL.MAX, { message: ERROR.USER.EMAIL.TOO_LONG(USER_LIMITS.EMAIL.MAX) })
        .email({ message: ERROR.USER.EMAIL.INVALID }),
    password: z.string()
        .min(USER_LIMITS.PASSWORD.MIN, { message: ERROR.USER.PASSWORD.TOO_SHORT(USER_LIMITS.PASSWORD.MIN) })
        .max(USER_LIMITS.PASSWORD.MAX, { message: ERROR.USER.PASSWORD.TOO_LONG(USER_LIMITS.PASSWORD.MAX) }),
});

export default RegisterUserSchema;