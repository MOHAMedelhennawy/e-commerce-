import { ERRORS } from "../../errors/constants/errors.js";
import { ValidationError } from "../../errors/domain.errors.js";
import Auditable from "../Auditable.js";
import type { IProduct } from "../interfaces/entities.interfaces/product.interface.js";
import type { IProductSpec } from "../interfaces/value-object.interfaces/prodcutSpec.interface.js";
import { ProductSpec } from "../value-objects/ProductSpec.js";

export class Product extends Auditable implements IProduct{
    private spec: IProductSpec;

    constructor(spec: IProductSpec) {
        super();
        this.spec = spec;
    }

    getSpec(): IProductSpec {
        return new ProductSpec(this.spec.getTitle(), this.spec.getPrice());
    }

    setPrice(price: number): void {
        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0)
            throw new ValidationError(ERRORS.PRODUCT.PRICE);

        this.spec.setPrice(price);
        this.touch();
    }

    setTitle(title: string): void {
        if (typeof title !== "string" || title === "")
            throw new ValidationError(ERRORS.PRODUCT.TITLE);
        
        this.spec.setTitle(title);
        this.touch();
    }

    static ensureValid(product: IProduct) {
        if (!product) {
            throw new ValidationError(ERRORS.PRODUCT.MISSING);
        }

        if (!(product instanceof Product)) {
            throw new ValidationError(ERRORS.PRODUCT.INVALID);
        }
    }
}