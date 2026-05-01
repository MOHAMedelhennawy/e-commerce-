import CreateProductInputDTO from "./create.product.dto";

interface UpdateProductInputDTO extends Partial<CreateProductInputDTO> {
}

export default UpdateProductInputDTO;