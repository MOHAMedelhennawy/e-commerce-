import ID from "../../../../shared/domain/value-object/Id-object";
import Product from "../entities/product";

interface IProductRepository<TTransaction = unknown> {
    findUnique(id: ID): Promise<Product | undefined>;
    findAll(): Promise<Product[]>;
    findManyByIds(ids: ID[]): Promise<Product[]>;
    save(product: Product): Promise<Product>;
    saveMany(products: Product[], tx?: TTransaction): Promise<void>;
    create(product: Product): Promise<Product>;
    deleteById(id: ID): Promise<void>;
}

export default IProductRepository;