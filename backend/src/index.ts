import path from 'path';
import dotenv from 'dotenv'
import express from "express";
import { fileURLToPath } from 'url';
import type { Request, Response, NextFunction, Application } from 'express';
import globalErrorHandler from "./presentation/common/middlewares/global.error.handler";
import ProductRepository from './modules/product/infrastructure/repositories/ProductRepository';
import ProductPersistencMapper from './modules/product/infrastructure/mappers/product.persistenc.mapper';
import ProductService from './modules/product/application/services/product.service';
import ProductController from './modules/product/presentation/controllers/product.controller';
import productRouter from './modules/product/presentation/routes/product.routes';
import { prisma } from './infrastructure/database/prisma';

const PORT = 4000;
const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
dotenv.config({ 
  path: path.resolve(__dirname, '../.env') 
});

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log("Incoming request path:", req.url);
	if (req.url.includes("://")) {
		return res.status(400).json({
			error: "Invalid URL Format",
			code: "INVALID_URL_PATH",
			message: "URL path contains invalid characters",
		});
	}
	next();
});

const repository = new ProductRepository(prisma.product, new ProductPersistencMapper());
const service = new ProductService(repository)
const controller = new ProductController(service)

app.use("/api/v1/product", productRouter(controller));

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
})