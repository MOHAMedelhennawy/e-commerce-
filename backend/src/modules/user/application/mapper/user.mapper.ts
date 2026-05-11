import User from "../../domain/entities/user";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type UserOutputDTO from "../dtos/user.output.dto";

export default class UserApplicationMapper implements IApplicationMapper<User, UserOutputDTO> {
    toDTO(user: User): UserOutputDTO {
        return {
            id: user.getId().toString(),
            name: user.getName().toString(),
            email: user.getEmail().toString(),
        }
    }
}