import { PRODUCT_LIMITS } from "../../../../shared/domain/constants/domain.constants";
import { ValidationError } from "../../../../shared/domain/errors/domain.errors";
import ERROR from "../../../../shared/domain/errors/error.messages";

export default class Title {

    private constructor(private readonly text: string){}

    toString(): string {
        return this.text;
    }

    static create(text: string): Title {
        const TITLE_LIMIST = PRODUCT_LIMITS.TITLE;

        if (!text || text.length < TITLE_LIMIST.MIN) {
            throw new ValidationError(ERROR.PRODUCT.TITLE.TOO_SHORT(TITLE_LIMIST.MIN));
        }

        if (text.length > TITLE_LIMIST.MAX) {
            throw new ValidationError(ERROR.PRODUCT.TITLE.TOO_LONG(TITLE_LIMIST.MAX));
        }

        return new Title(text);
    }
}