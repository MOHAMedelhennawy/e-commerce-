import User from "../../domain/entities/user";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type IPasswordHasher from "../interfaces/password.hasher.interface";
import type IUserRepository from "../../domain/repositories/user.repository.interface";
import type RegiserUserInputDTO from "../dtos/register.user.input.dto";
import type RegisterUserOutputDTO from "../dtos/register.user.output.dto";

export default class RegisterUserService {
    constructor(
        private repository: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private mapper: IApplicationMapper<User, RegiserUserInputDTO, RegisterUserOutputDTO>
    ) {}

    async execute(dto: RegiserUserInputDTO): Promise<RegisterUserOutputDTO> {
        const emailIsExist = await this.repository.findUserByEmail(dto.email);

        if (emailIsExist) {
            throw new Error("This email already exit");
        }

        const hashedPassword = await this.passwordHasher.hash(dto.password);
        const hashedDTO = { ...dto, password: hashedPassword };
        const user = this.mapper.toDomain(hashedDTO);
        await this.repository.createUser(user);
        return this.mapper.toDTO(user);
    }
}