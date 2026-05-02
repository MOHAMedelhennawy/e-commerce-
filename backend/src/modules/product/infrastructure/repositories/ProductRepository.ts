import Product from "../../domain/entities/product";
import type ProductRow from "../types/productRow"
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";
import type IProductRepository from "../../domain/repositories/product-repository-interface";
import { PrismaClient } from "../../../../../generated/prisma/client";

type ProductDelegate = PrismaClient["product"]

class ProductRepository implements IProductRepository {
    private model: ProductDelegate;
    private mapper: IPersistencMapper<Product, ProductRow>;

    constructor(model: ProductDelegate, mapper: IPersistencMapper<Product, ProductRow>) {
        this.model = model;
        this.mapper = mapper;
    }

    async findUnique(id: string): Promise<Product | undefined> {
        const row = await this.model.findFirst({ where: { id } });
        return row ? this.mapper.toDomain(row) : undefined;
    }

    async findAll(): Promise<Product[]> {
        const rows = await this.model.findMany();
        return rows.map(
            row => this.mapper.toDomain(row),
        )
    }

    async save(product: Product): Promise<Product> {
        const data = this.mapper.toPersistence(product);

        const row = await this.model.update({
            where: { id: data.id },
            data,
        })

        return this.mapper.toDomain(row);
    }
    
    async create(product: Product): Promise<Product> {
        const data = this.mapper.toPersistence(product);
        const row = await this.model.create({ data })
        return this.mapper.toDomain(row);
    }

    async deleteById(id: string): Promise<void> {
        await this.model.delete({ where: { id } });
    }
}

export default ProductRepository;