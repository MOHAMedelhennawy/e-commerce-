import type { RequestHandler } from "express";
import ProductService from "../../application/services/product.service";
import CreateProductRequestSchema from "../../application/dtos/create.product.dto";
import UpdateProductRequestSchema from "../../application/dtos/update-product-dto";
import IdSchema from "../../../../shared/application/dtos/id.schema";

export default class ProductController {
    private service;

    constructor(service: ProductService) {
        this.service = service;
    }

    index: RequestHandler = async (req, res, next) => {
        const products = await this.service.getAllProducts();
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
        const requestBody = CreateProductRequestSchema.parse(req.body);
        const product = await this.service.createProduct(requestBody);

        res.status(201).json({
            success: true,
            data: product
        });
    }

    update: RequestHandler = async (req, res, next) => {
        const id = IdSchema.parse(req.params.id);
        const requestBody = UpdateProductRequestSchema.parse(req.body);
        const updatedProduct = await this.service.updateProduct(id, requestBody);

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