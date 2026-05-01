export const USER_LIMITS = {
    NAME: {
        MIN: 2,
        MAX: 100
    },
    EMAIL: {
        MIN: 4,
        MAX: 255
    },
    PASSWORD: {
        MIN: 10,
        MAX: 255
    }
} as const;

export const PRODUCT_LIMITS = {
    TITLE: {
        MIN: 3,
        MAX: 255
    },
    PRICE: {
        MIN: 0
    },
    STOCK: {
        MIN: 0
    }
} as const;