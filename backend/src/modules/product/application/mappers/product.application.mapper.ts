import Product from "../../domain/entities/product";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type ProductResponseDTO from "../dtos/product-response-dto";

export default class ProductApplicationMapper implements IApplicationMapper<Product, ProductResponseDTO>{
    toDTO(product: Product): ProductResponseDTO {
        return {
            id: product.getId().toString(),
            title: product.getTitle().toString(),
            price: product.getPrice().toNumber(),
            stock: product.getStock().toNumber(),
            createdAt: product.getTimestamps().createdAt,
        }
    }
}