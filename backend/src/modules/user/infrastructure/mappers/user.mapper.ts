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
            row.created_at,
            row.updated_at
        );
    }
    toPersistence(user: User): UserRow {
        return {
            id: user.getId(),
            name: user.getName().toString(),
            email: user.getEmail().toString(),
            password: user.getPassword(),
            created_at: user.getTimestamps().createdAt,
            updated_at: user.getTimestamps().updatedAt,
        }
    }
    
}
