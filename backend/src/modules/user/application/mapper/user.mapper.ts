import ID from "../../../../shared/domain/value-object/Id-object";
import User from "../../domain/entities/user";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type UserInputDTO from "../dtos/user.intput.dto";
import type UserOutputDTO from "../dtos/user.output.dto";

export default class UserApplicationMapper implements IApplicationMapper<User, UserInputDTO, UserOutputDTO> {
    toDomain(dto: UserInputDTO): User {
        return new User(
            ID.generate(),
            dto.name,
            dto.email,
            dto.password,
            new Date(),
            new Date(),
        )
    }

    toDTO(user: User): UserOutputDTO {
        return {
            id: user.getId(),
            name: user.getName().toString(),
            email: user.getEmail().toString(),
        }
    }
    
}