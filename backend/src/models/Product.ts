import Auditable from "./Auditable.ts";
import { ProductSpec } from "./ProductSpec.ts";

export class Product extends Auditable{
    private spec: ProductSpec;

    constructor(id: string, spec: ProductSpec) {
        super(id);
        this.spec = spec;
    }

    getSpec(): ProductSpec {
        return new ProductSpec(this.spec.getTitle(), this.spec.getPrice());
        // return this.spec;
    }

    setPrice(price: number) {
        if (typeof price !== "number" || price <= 0)
            throw new Error("Invalid price");

        this.spec.setPrice(price);
    }

    setTitle(title: string) {
        if (typeof title !== "string" || title === "")
            throw new Error("Invalid title");
        
        this.spec.setTitle(title);
    }
}