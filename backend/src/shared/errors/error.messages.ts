const ERROR = {
    NOT_FOUND: (model: string, id: string) => `Failed to find ${model} with id: '${id}'`,
    ID: {
        MISSING: "Missing id",
        INVALID: (id: string) => `Invalid id value: '${id}'`
    },
    USER: {
        NAME: {
            TOO_SHORT: (min: number) => `Name must be at least ${min} characters long`,
            TOO_LONG: (max: number) => `Name must be at least ${max} characters long`,
        },
        EMAIL: {
            TOO_SHORT: (min: number) => `Email must be at least ${min} characters long`,
            TOO_LONG: (max: number) => `Email must be at least ${max} characters long`,
            INVALID: "Invalid email format",
        }
    }
}

export default ERROR;