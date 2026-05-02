import User from "../../domain/entities/user";
import { PrismaClient } from "../../../../../generated/prisma/client";
import type IUserRepository from "../../domain/repositories/user.repository.interface";
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";
import type UserRow from "../types/user.row";

type UserDelegate = PrismaClient["users"]

export default class UserRepository implements IUserRepository {

    constructor(
        private model: UserDelegate,
        private mapper: IPersistencMapper<User, UserRow>
    ) {}

    async findUserByEmail(email: string): Promise<User | undefined> {
        const row = await this.model.findUnique({
            where: { email },
        })
        
        if (!row) {
            return undefined;
        }

        return this.mapper.toDomain(row);
    }

    async createUser(user: User): Promise<User> {
        const data = this.mapper.toPersistence(user);
        const row = await this.model.create({ data });
        return this.mapper.toDomain(row);
    }
    
}