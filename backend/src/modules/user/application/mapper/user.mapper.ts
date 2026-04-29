import ID from "../../../../shared/domain/value-object/Id-object";
import User from "../../domain/entities/user";
import type RegisterUserInputDTO from "../dtos/register.user.input.dto";
import type RegisterUserOutputDTO from "../dtos/register.user.output.dto";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";

export default class UserApplicationMapper implements IApplicationMapper<User, RegisterUserInputDTO, RegisterUserOutputDTO> {
    toDomain(dto: RegisterUserInputDTO): User {
        return new User(
            ID.generate(),
            dto.name,
            dto.email,
            dto.password,
            new Date(),
            new Date(),
        )
    }

    toDTO(user: User): RegisterUserOutputDTO {
        return {
            id: user.getId(),
            name: user.getName().toString(),
            email: user.getEmail().toString(),
            created_at: user.getTimestamps().createdAt            
        }
    }
    
}