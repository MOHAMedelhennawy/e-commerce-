import Role from "../../domain/enums/role.enum";

type UserRow = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    created_at: Date,
    updated_at: Date,
}

export default UserRow;