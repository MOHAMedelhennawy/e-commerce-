import type { RequestHandler } from "express";
import ProductService from "../../application/services/product.service";
// schemas
import IdSchema from "../../../../shared/application/dtos/id.schema";
import CreateProductRequestSchema from "../schemas/create.product.schema";
import UpdateProductRequestSchema from "../schemas/update.product.schema";
// dtos
import type CreateProductInputDTO from "../../application/dtos/create.product.dto";
import type ProductResponseDTO from "../../application/dtos/product-response-dto";
import type UpdateProductInputDTO from "../../application/dtos/update-product-dto";

export default class ProductController {
    private service;

    constructor(service: ProductService) {
        this.service = service;
    }

    index: RequestHandler = async (req, res, next) => {
        const products: ProductResponseDTO[] = await this.service.getAllProducts();
        res.status(200).json({
            success: true,
            data: products
          }
        );
    }

    show: RequestHandler = async (req, res, next) => {
        const id = IdSchema.parse(req.params.id);
        const product = await this.service.getProductByID(id);
        res.status(200).json({
            success: true,
            data: product
        });
    }

    store: RequestHandler = async (req, res, next) => {
        const requestBody: CreateProductInputDTO = CreateProductRequestSchema.parse(req.body);
        const product: ProductResponseDTO = await this.service.createProduct(requestBody);

        res.status(201).json({
            success: true,
            data: product
        });
    }

    update: RequestHandler = async (req, res, next) => {
        const id = IdSchema.parse(req.params.id);
        const requestBody: UpdateProductInputDTO = UpdateProductRequestSchema.parse(req.body);
        const updatedProduct: ProductResponseDTO = await this.service.updateProduct(id, requestBody);

        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    }

    destroy: RequestHandler = async (req, res, next) => {
        const id = IdSchema.parse(req.params.id);
        await this.service.deleteProduct(id);
        res.status(200).json({
            success: true
        });
    }
}