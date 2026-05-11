import ID from "../../../../shared/domain/value-object/Id-object";
import Title from "../../domain/value-objects/title.object";
import Money from "../../../../shared/domain/value-object/money-object";
import Stock from "../../../../shared/domain/value-object/stock.object";
import Product from "../../domain/entities/product";
import ERROR from "../../../../shared/domain/errors/error.messages";
import { NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import type IProductRepository from "../../domain/repositories/product-repository-interface"
import type ProductResponseDTO from "../dtos/product-response-dto";
import type CreateProductInputDTO from "../dtos/create.product.dto";
import type UpdateProductInputDTO from "../dtos/update-product-dto";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";

export default class ProductService {
    private model: string;

    constructor(
        private repository: IProductRepository,
        private mapper: IApplicationMapper<Product, ProductResponseDTO>
    ) {
        this.repository = repository;
        this.model = "product";
    }

    async getAllProducts(): Promise<ProductResponseDTO[]>{
        const products = await this.repository.findAll();
        return products.map(product => this.mapper.toDTO(product));
    }

    async getProductByID(id: string): Promise<ProductResponseDTO> {
        const productId: ID = ID.create(id);
        const product = await this.repository.findUnique(productId);
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        return this.mapper.toDTO(product);
    }

    async createProduct(dto: CreateProductInputDTO): Promise<ProductResponseDTO> {
        const product = Product.create(dto.title, dto.price, dto.stock);
        await this.repository.create(product);
        return this.mapper.toDTO(product);
    }

    async updateProduct(id: string, dto: UpdateProductInputDTO): Promise<ProductResponseDTO> {
        const productId = ID.create(id);
        const product = await this.repository.findUnique(productId);
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        const title = dto.title ? Title.create(dto.title) : undefined;
        const price = dto.price ? Money.create(dto.price) : undefined;
        const stock = dto.stock ? Stock.create(dto.stock) : undefined;

        product.updateProduct(title, price, stock);
        await this.repository.save(product);
        return this.mapper.toDTO(product);
    }

    async deleteProduct(id: string): Promise<void> {
        const productId: ID = ID.create(id);
        const isExist = await this.repository.findUnique(productId);
        if (!isExist) {
            throw new NotFoundError(ERROR.NOT_FOUND(this.model, id));
        }

        await this.repository.deleteById(productId);
    }
}