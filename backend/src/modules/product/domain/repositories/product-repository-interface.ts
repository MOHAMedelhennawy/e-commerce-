import ID from "../../../../shared/domain/value-object/Id-object";
import Product from "../entities/product";

interface IProductRepository {
    findUnique(id: ID): Promise<Product | undefined>;
    findAll(): Promise<Product[]>;
    save(product: Product): Promise<Product>;
    create(product: Product): Promise<Product>;
    deleteById(id: ID): Promise<void>;
}

export default IProductRepository;