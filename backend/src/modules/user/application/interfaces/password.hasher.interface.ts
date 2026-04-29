interface IPasswordHasher {
    hash(password: string): Promise<string>;
}

export default IPasswordHasher;