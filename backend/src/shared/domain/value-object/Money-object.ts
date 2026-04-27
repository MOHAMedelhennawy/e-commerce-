import { ValidationError } from "../errors/domain.errors";

export default class Money {
    protected amount!: number;

    constructor(amount: number) {
        this.amount = this.validateAmount(amount);
    }

    getAmount(): number {
        return this.amount;
    }

    setAmount(amount: number): void {
        this.validateAmount(amount);
        this.amount = amount;
    }

    private validateAmount(amount: number): number {
        if (amount == null || amount <= 0) {
            throw new ValidationError("amount must be greater than 0");
        }

        return amount;
    }
}