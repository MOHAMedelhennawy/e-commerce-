import Product from "../../domain/entities/product";
import type ProductRow from "../types/productRow";
import ProductSpec from "../../domain/value-objects/ProductSpec-object";
import { Prisma } from "../../../../../generated/prisma/client";
import type IPersistencMapper from "../../../../infrastructure/mappers/persistenc.mapper.interface";

export default class ProductPersistencMapper implements IPersistencMapper<Product, ProductRow>{
    toDomain(row: ProductRow): Product {
        return new Product(
            row.id,
            new ProductSpec(row.title, row.price.toNumber(), row.stock),
            row.createdAt,
            row.updatedAt
        );
    }

    toPersistence(product: Product): ProductRow {
        return {
            id: product.getId(),
            title: product.getSpec().getTitle(),
            price: new Prisma.Decimal(product.getSpec().getPrice()),
            stock: product.getSpec().getStock(),
            createdAt: product.getTimestamps().createdAt,
            updatedAt: product.getTimestamps().updatedAt,
        };
    }
}