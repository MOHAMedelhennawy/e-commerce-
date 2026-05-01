import CreateProductRequestSchema from "./create.product.schema";

const UpdateProductRequestSchema = CreateProductRequestSchema.partial();

export default UpdateProductRequestSchema;