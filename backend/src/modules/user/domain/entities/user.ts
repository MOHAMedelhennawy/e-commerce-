import Auditable from "../../../../shared/domain/entities/Auditable";
import Email from "../value-object/email.object";
import Name from "../value-object/name.object";

export default class User extends Auditable {
    private name: Name;
    private email: Email;
    private hashedPassword: string;

    constructor(id: string, name: string, email: string, hashedPassword: string, created_at: Date, updated_at: Date) {
        super(id, created_at, updated_at);
        this.name = Name.create(name)
        this.email = Email.create(email);
        this.hashedPassword = hashedPassword;
    }

    getName(): Name { return this.name; }
    getEmail(): Email { return this.email; }
    getPassword(): string { return this.hashedPassword; }

    setName(name: string): void { this.name = Name.create(name); }
    setEmail(email: string): void { this.email = Email.create(email); }
}