import type UserInputDTO from "../user.input.dto";

interface LoginUserInputDTO extends Omit<UserInputDTO, "name">{};

export default LoginUserInputDTO;