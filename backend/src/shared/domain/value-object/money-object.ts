import { Decimal } from "@prisma/client/runtime/client";
import { PRODUCT_LIMITS } from "../constants/domain.constants";
import { ValidationError } from "../errors/domain.errors";
import ERROR from "../errors/error.messages";

export default class Money {
    private constructor(private readonly cents: number) {}

    toNumber(): number {
        return this.cents / 100;
    }

    multiply(factor: number): Money {
        return new Money(Math.round(this.cents * factor));
    }

    add(other: Money): Money {
        return new Money(this.cents + other.cents);
    }

    static create(amount: number): Money {
        if (amount == null || amount <= PRODUCT_LIMITS.PRICE.MIN) {
            throw new ValidationError(ERROR.PRODUCT.MONEY.INVALID);
        }

        return new Money(Math.round(amount * 100));
    }

    static reconstitute(amount: number): Money {
        return new Money(Math.round(amount * 100));
    }
}