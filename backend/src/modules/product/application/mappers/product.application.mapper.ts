import Product from "../../domain/entities/product";
import ProductSpec from "../../domain/value-objects/ProductSpec-object";
import ID from "../../../../shared/domain/value-object/Id-object";
import type { CreateProductInputDTO } from "../dtos/create.product.dto";
import type ProductResponseDTO from "../dtos/product-response-dto";

export default class ProductApplicationMapper {
    static toDomain(dto: CreateProductInputDTO): Product {
        return new Product(
            ID.generate(),
            new ProductSpec(dto.title, dto.price, dto.stock),
            new Date(),
            new Date()
        )
    }

    static toDTO(product: Product): ProductResponseDTO {
        const spec = product.getSpec();

        return {
            id: product.getId(),
            title: spec.getTitle(),
            price: spec.getPrice(),
            stock: spec.getStock(),
            createdAt: product.getTimestamps().createdAt,
        }
    }
}