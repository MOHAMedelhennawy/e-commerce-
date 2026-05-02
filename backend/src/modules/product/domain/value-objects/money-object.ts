import { PRODUCT_LIMITS } from "../../../../shared/domain/constants/domain.constants";
import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import ERROR from "../../../../shared/domain/errors/error.messages";

export default class Money {
    private constructor(private readonly amount: number) {}

    toNumber(): number {
        return this.amount;
    }

    static create(amount: number): Money {
        if (amount == null || amount <= PRODUCT_LIMITS.PRICE.MIN) {
            throw new ValidationError(ERROR.PRODUCT.MONEY.INVALID);
        }

        return new Money(amount);
    }

    static reconstitute(amount: number): Money {
        return new Money(amount);
    }
}