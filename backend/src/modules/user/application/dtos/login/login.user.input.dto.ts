import type UserInputDTO from "../user.intput.dto";

interface LoginUserInputDTO extends Omit<UserInputDTO, "name">{};

export default LoginUserInputDTO;