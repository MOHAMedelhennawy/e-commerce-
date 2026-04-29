import Product from "../entities/product";

interface IProductRepository {
    findUnique(id: string): Promise<Product | undefined>;
    findAll(): Promise<Product[]>;
    save(product: Product): Promise<Product>;
    create(product: Product): Promise<Product>;
    deleteById(id: string): Promise<void>;
}

export default IProductRepository;