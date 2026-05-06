import express from "express";
import type { Request, Response, NextFunction, Application } from 'express';
import globalErrorHandler from "./presentation/middlewares/global.error.handler";
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
import LoginRouter from './modules/user/presentation/routes/login.routes';
import { prisma } from './infrastructure/database/prisma';
import BcryptPasswordHasher from './modules/user/infrastructure/service/bcrypt.password.hasher';
import LoginUserController from './modules/user/presentation/controller/login.controller';
import LoginUser from './modules/user/application/services/login.user.service';
import JwtService from "./modules/user/infrastructure/service/jwt.service";
import cookieParser from "cookie-parser";

const PORT = 4000;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());

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
const jwtService = new JwtService();

// Product
const productRepository = new ProductRepository(prisma.product, new ProductPersistencMapper());
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)
app.use("/api/v1/product", productRouter(productController, jwtService));

// User
const userRepository = new UserRepository(prisma.users, new UserMapper());
const bcryptPasswordHasher = new BcryptPasswordHasher()
const userApplicationMapper = new UserApplicationMapper()

// Register service
const registerService = new RegisterUserService(userRepository, bcryptPasswordHasher, userApplicationMapper, jwtService);
const registerController = new RegisterUserController(registerService);
app.use("/api/v1/register", RegisterRouter(registerController));

// Login service
const loginService = new LoginUser(userRepository, bcryptPasswordHasher, userApplicationMapper, jwtService);
const loginUserController = new LoginUserController(loginService);
app.use("/api/v1/login", LoginRouter(loginUserController))

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
})