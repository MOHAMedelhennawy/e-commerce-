import Product from "../../domain/entities/product";
import ID from "../../../../shared/domain/value-object/Id-object";
import type CreateProductInputDTO from "../dtos/create.product.dto";
import type ProductResponseDTO from "../dtos/product-response-dto";

export default class ProductApplicationMapper {
    static toDomain(dto: CreateProductInputDTO): Product {
        return new Product(
            ID.generate(),
            dto.title,
            dto.price,
            dto.stock,
            new Date(),
            new Date()
        )
    }

    static toDTO(product: Product): ProductResponseDTO {
        return {
            id: product.getId(),
            title: product.getTitle().toString(),
            price: product.getPrice().toNumber(),
            stock: product.getStock().toNumber(),
            createdAt: product.getTimestamps().createdAt,
        }
    }
}