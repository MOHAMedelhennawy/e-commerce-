import Product from "../../domain/entities/product";
import type CreateProductInputDTO from "../dtos/create.product.dto";
import type ProductResponseDTO from "../dtos/product-response-dto";

export default class ProductApplicationMapper {
    static toDomain(dto: CreateProductInputDTO): Product {
        return Product.create(
            dto.title,
            dto.price,
            dto.stock,
        )
    }

    static toDTO(product: Product): ProductResponseDTO {
        return {
            id: product.getId().toString(),
            title: product.getTitle().toString(),
            price: product.getPrice().toNumber(),
            stock: product.getStock().toNumber(),
            createdAt: product.getTimestamps().createdAt,
        }
    }
}