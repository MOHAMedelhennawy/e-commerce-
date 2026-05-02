import ERROR from "../../../../shared/domain/errors/error.messages";
import { NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import ProductApplicationMapper from "../mappers/product.application.mapper";
import type IProductRepository from "../../domain/repositories/product-repository-interface"
import type ProductResponseDTO from "../dtos/product-response-dto";
import type CreateProductInputDTO from "../dtos/create.product.dto";
import type UpdateProductInputDTO from "../dtos/update-product-dto";

export default class ProductService {
    private repository: IProductRepository
    private model: string;

    constructor(repository: IProductRepository) {
        this.repository = repository;
        this.model = "product";
    }

    async getAllProducts(): Promise<ProductResponseDTO[]>{
        const products = await this.repository.findAll();
        return products.map(product => ProductApplicationMapper.toDTO(product));
    }

    async getProductByID(id: string): Promise<ProductResponseDTO> {
        const product = await this.repository.findUnique(id);
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        return ProductApplicationMapper.toDTO(product);
    }

    async createProduct(dto: CreateProductInputDTO): Promise<ProductResponseDTO> {
        const product = ProductApplicationMapper.toDomain(dto);
        await this.repository.create(product);
        return ProductApplicationMapper.toDTO(product);
    }

    async updateProduct(id: string, dto: UpdateProductInputDTO): Promise<ProductResponseDTO> {
        const product = await this.repository.findUnique(id);
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        product.updateProduct(dto.title, dto.price, dto.stock);
        await this.repository.save(product);
        return ProductApplicationMapper.toDTO(product);
    }

    async deleteProduct(id: string): Promise<void> {
        const isExist = await this.repository.findUnique(id);
        if (!isExist) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        await this.repository.deleteById(id);
    }
}