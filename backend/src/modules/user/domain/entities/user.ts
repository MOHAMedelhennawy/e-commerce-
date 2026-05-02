import Auditable from "../../../../shared/domain/entities/Auditable";
import ID from "../../../../shared/domain/value-object/Id-object";
import Email from "../value-object/email.object";
import Name from "../value-object/name.object";

export default class User extends Auditable {
    private name: Name;
    private email: Email;
    private password: string;

    private constructor(id: ID, name: Name, email: Email, hashedPassword: string, created_at: Date, updated_at: Date) {
        super(id, created_at, updated_at);
        this.name = name
        this.email = email;
        this.password = hashedPassword;
    }

    // Getters
    getName(): Name { return this.name; }
    getEmail(): Email { return this.email; }
    getPassword(): string { return this.password; }

    // Setters
    setName(name: string): void { this.name = Name.create(name); }
    setEmail(email: string): void { this.email = Email.create(email); }

    // Factories
    /**
     * Factory method to create new entity, if the user if fully new and need
     * to validate business rules first before store it in database
     * 
     * @param name
     * @param email
     * @param hashedPassword 
     * 
     * @returns new user entity from user if, or throw an error when invalid data is passed to VO
     */
    static create(name: string, email: string, hashedPassword: string): User {
        return new User(
            ID.generate(),
            Name.create(name),
            Email.create(email),
            hashedPassword,
            new Date,
            new Date,
        );
    }

    /**
     * Factory method to create entity, if user data is actually validated and stored in the database
     * 
     * @param id user id
     * @param name user name
     * @param email user email
     * @param password user hashed password
     * @param created_at 
     * @param updated_at 
     *
     * @returns new user entity any way, no error is should to throw
     */
    static reconstitute(id: string, name: string, email: string, password: string, created_at: Date, updated_at: Date) {
        return new User(
            ID.reconstitute(id),
            Name.reconstitute(name),
            Email.reconstitute(email),
            password,
            created_at,
            updated_at,
        )
    }
}