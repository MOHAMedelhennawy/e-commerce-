import UserOutputDTO from "../user.output.dto";

interface RegisterUserOutputDTO extends UserOutputDTO{
    token: string,
}

export default RegisterUserOutputDTO;