import User from "../entities/user";

interface IUserRepository {
    findUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: User): Promise<User>;
}

export default IUserRepository;