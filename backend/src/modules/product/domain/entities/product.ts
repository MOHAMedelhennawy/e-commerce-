import Auditable from "../../../../shared/domain/entities/Auditable.ts";
import ProductSpec from "../value-objects/ProductSpec-object.ts";

export default class Product extends Auditable {
    private spec: ProductSpec;

    constructor(id: string, spec: ProductSpec, created_at: Date, updated_at: Date) {
        super(id, created_at, updated_at)
        this.spec = spec;
    }

    getSpec(): ProductSpec {
        return this.spec;
    }

    updateSpecInformation(title?: string, price?: number, stock?: number) {
        this.spec.updateInformation(title, price, stock);
        this.touch();
    }
}