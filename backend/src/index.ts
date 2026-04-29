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
import UserRepository from './modules/user/infrastructure/repositories/user.repository';
import UserMapper from "./modules/user/infrastructure/mappers/user.mapper";
import RegisterUserService from "./modules/user/application/services/register.user.service";
import UserApplicationMapper from "./modules/user/application/mapper/user.mapper";
import RegisterUserController from "./modules/user/presentation/controller/register.controller";
import RegisterRouter from './modules/user/presentation/routes/register.routes';

import { prisma } from './infrastructure/database/prisma';
import BcryptPasswordHasher from './modules/user/infrastructure/security/bcrypt.password.hasher';

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

const productRepository = new ProductRepository(prisma.product, new ProductPersistencMapper());
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)
app.use("/api/v1/product", productRouter(productController));

const userRepository = new UserRepository(prisma.users, new UserMapper());
const registerService = new RegisterUserService(userRepository, new BcryptPasswordHasher(), new UserApplicationMapper());
const registerController = new RegisterUserController(registerService);
app.use("/api/v1/register", RegisterRouter(registerController));

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
})