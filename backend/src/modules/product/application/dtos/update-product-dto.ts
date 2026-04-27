import * as z from "zod";
import CreateProductRequestDTO from "./create.product.dto";

const UpdateProductRequestSchema = CreateProductRequestDTO.partial();

export type UpdateProductInputDTO = z.infer<typeof UpdateProductRequestSchema>;

export default UpdateProductRequestSchema;