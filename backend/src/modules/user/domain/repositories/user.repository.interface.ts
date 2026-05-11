import User from "../entities/user";
import Email from "../value-object/email.object";

interface IUserRepository {
    findUserByEmail(email: Email): Promise<User | undefined>;
    createUser(user: User): Promise<User>;
}

export default IUserRepository;