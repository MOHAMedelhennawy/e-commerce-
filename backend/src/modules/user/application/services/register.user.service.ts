import User from "../../domain/entities/user";
import Email from "../../domain/value-object/email.object";
import ERROR from "../../../../shared/domain/errors/error.messages";
import Unauthorized from "../../../../shared/domain/errors/unauthorized.error";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type IPasswordHasher from "../interfaces/password.hasher.interface";
import type IUserRepository from "../../domain/repositories/user.repository.interface";
import type RegiserUserInputDTO from "../dtos/register/register.user.input.dto";
import type RegisterUserOutputDTO from "../dtos/register/register.user.output.dto";

export default class RegisterUserService {
    constructor(
        private repository: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private mapper: IApplicationMapper<User, RegiserUserInputDTO, RegisterUserOutputDTO>
    ) {}

    async execute(dto: RegiserUserInputDTO): Promise<RegisterUserOutputDTO> {
        const email = Email.create(dto.email).toString();
        const emailIsExist = await this.repository.findUserByEmail(email);

        if (emailIsExist) {
            throw new Unauthorized(ERROR.AUTH.EMAIL.EXIST);
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password);
        const user = User.create(dto.name, dto.email, hashedPassword);
        await this.repository.createUser(user);
        return this.mapper.toDTO(user);
    }
}