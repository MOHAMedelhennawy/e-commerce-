import UserOutputDTO from "../user.output.dto";

interface LoginUserOutputDTO extends UserOutputDTO {
    token: string
}

export default LoginUserOutputDTO;