import User from "../../domain/entities/user";
import Email from "../../domain/value-object/email.object";
import Unauthorized from "../../../../shared/domain/errors/unauthorized.error";
import type UserOutputDTO from "../dtos/user.output.dto";
import type UserInputDTO from "../dtos/user.intput.dto";
import type LoginUserInputDTO from "../dtos/login/login.user.input.dto";
import type LoginUserOutputDTO from "../dtos/login/login.user.output.dto";
import type IUserRepository from "../../domain/repositories/user.repository.interface";
import type IPasswordHasher from "../interfaces/password.hasher.interface";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import ERROR from "../../../../shared/domain/errors/error.messages";
import type ITokenService from "../interfaces/token.service.interface";

export default class LoginUser {
    constructor(
        private repository: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private mapper: IApplicationMapper<User, UserInputDTO, UserOutputDTO>,
        private tokenService: ITokenService
    ){}

    async execute(dto: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
        const email = Email.create(dto.email).toString();
        const user = await this.repository.findUserByEmail(email);
        if (!user) {
            throw new Unauthorized(ERROR.AUTH.CREDENTIALS.INVALID);
        }

        const passowrdIsMatch = await this.passwordHasher.verify(dto.password, user.getPassword());
        if (!passowrdIsMatch) {
            throw new Unauthorized(ERROR.AUTH.CREDENTIALS.INVALID);
        }

        const token = this.tokenService.sign(user);
        return { ...this.mapper.toDTO(user), token};
    }
}