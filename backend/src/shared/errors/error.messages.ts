const ERROR = {
    NOT_FOUND: (model: string, id: string) => `Failed to find ${model} with id: '${id}'`,
    ID: {
        MISSING: "Missing id",
        INVALID: (id: string) => `Invalid id value: '${id}'`
    }
}

export default ERROR;