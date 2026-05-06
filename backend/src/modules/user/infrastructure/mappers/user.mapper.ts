import User from "../../domain/entities/user";
import type UserRow from "../types/user.row";
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";

export default class UserMapper implements IPersistencMapper<User, UserRow> {
    toDomain(row: UserRow): User {
        return User.reconstitute(
            row.id,
            row.name,
            row.email,
            row.password,
            row.role,
            row.created_at,
            row.updated_at
        );
    }

    toPersistence(user: User): UserRow {
        return {
            id: user.getId().toString(),
            name: user.getName().toString(),
            email: user.getEmail().toString(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getTimestamps().createdAt,
            updated_at: user.getTimestamps().updatedAt,
        }
    }
    
}
