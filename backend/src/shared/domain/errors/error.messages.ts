const COMMON = {
    TOO_SHORT: (field: string, min: number) => `${field} must be at least ${min} charachter long`,
    TOO_LONG: (field: string, max: number) => `${field} must not exceed ${max} characters`
}

const ERROR = {
    NOT_FOUND: (model: string, id: string) => `Failed to find ${model} with id: '${id}'`,
    ID: {
        MISSING: "Missing id",
        INVALID: (id: string) => `Invalid id value: '${id}'`
    },
    PRODUCT: {
        TITLE: {
            TOO_SHORT: (min: number) => COMMON.TOO_SHORT('Title', min),
            TOO_LONG: (max: number) => COMMON.TOO_LONG('Title', max),
        },
        MONEY: {
            INVALID: "amount must be greater than 0"
        },
        STOCK: {
            INVALID: "Product stock cannot be a negative value."
        }
    },
    USER: {
        NAME: {
            TOO_SHORT: (min: number) => COMMON.TOO_SHORT('Name', min),
            TOO_LONG: (max: number) => COMMON.TOO_SHORT('Name', max),
        },
        EMAIL: {
            TOO_SHORT: (min: number) => COMMON.TOO_SHORT('Email', min),
            TOO_LONG: (max: number) => COMMON.TOO_SHORT('Email', max),
            INVALID: "Invalid email format",
        }
    },
    AUTH: {
        CREDENTIALS: {
            INVALID: "Invalid email or password",
        },
        EMAIL: {
            EXIST: "This email already exit"
        },
        REQUIRED: "Authentication Required",
    }
}

export default ERROR;