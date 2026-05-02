import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import ERROR from "../../../../shared/domain/errors/error.messages";
import { PRODUCT_LIMITS } from "../../../../shared/domain/constants/domain.constants";

export default class Stock {
    private constructor(private readonly amount: number){}

    toNumber(): number {
        return this.amount;
    }

    static create(amount: number): Stock {
        if (!amount || amount < PRODUCT_LIMITS.STOCK.MIN) {
            throw new ValidationError(ERROR.PRODUCT.STOCK.INVALID);
        }

        return new Stock(amount);
    }

    static reconstitute(amount: number): Stock {
        return new Stock(amount);
    }
}