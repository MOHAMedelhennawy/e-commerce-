import { InsufficientStockError, ValidationError } from "../../domain/errors/domain.errors";
import ERROR from "../../domain/errors/error.messages";
import { PRODUCT_LIMITS } from "../..//domain/constants/domain.constants";

export default class Stock {
    private constructor(private readonly amount: number){}

    toNumber(): number {
        return this.amount;
    }

    isAvialable(amount: number): boolean {
        return this.amount >= amount;
    }

    decrease(amount: number) {
        if (this.amount < amount) {
            throw new InsufficientStockError(ERROR.PRODUCT.OUT_OF_STOCK);
        }

        return new Stock(this.amount - amount);
    }

    static create(amount: number): Stock {
        if (amount == null || amount < PRODUCT_LIMITS.STOCK.MIN) {
            throw new ValidationError(ERROR.PRODUCT.STOCK.INVALID);
        }

        return new Stock(amount);
    }

    static reconstitute(amount: number): Stock {
        return new Stock(amount);
    }
}