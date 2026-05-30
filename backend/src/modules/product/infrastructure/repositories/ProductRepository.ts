import Product from "../../domain/entities/product";
import type ProductRow from "../types/productRow"
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";
import type IProductRepository from "../../domain/repositories/product-repository-interface";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import ID from "../../../../shared/domain/value-object/Id-object";

type ProductDelegate = PrismaClient["product"]

class ProductRepository implements IProductRepository<Prisma.TransactionClient> {
    private model: ProductDelegate;
    private mapper: IPersistencMapper<Product, ProductRow>;

    constructor(model: ProductDelegate, mapper: IPersistencMapper<Product, ProductRow>) {
        this.model = model;
        this.mapper = mapper;
    }

    findManyByIds(ids: ID[]): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    saveMany(products: Product[], tx?: Prisma.TransactionClient): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findUnique(id: ID): Promise<Product | undefined> {
        const row = await this.model.findFirst({ where: { id: id.toString() } });
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

    async deleteById(id: ID): Promise<void> {
        await this.model.delete({ where: { id: id.toString() } });
    }
}

export default ProductRepository;