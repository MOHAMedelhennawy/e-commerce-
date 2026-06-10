import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import ERROR from "../../../../shared/domain/errors/error.messages";
import { InsufficientStockError, NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import type IProductRepository from "../../../product/domain/repositories/product-repository-interface"
import type CartItemInputDTO from "../dtos/cart.item.input.dto"
import type ICartRepository from "../../domain/repository/cart.repository.interface";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type CartItemResponseDTO from "../dtos/cart.item.response.dto";
import type { IQueryableProduct } from "../../../../shared/domain/interfaces/queryable.product.interface";

export default class AddItemToCartUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private productRepository: IQueryableProduct,
        private mapper: IApplicationMapper<Cart, CartItemResponseDTO>
    ) {}

    async execute(dto: CartItemInputDTO): Promise<CartItemResponseDTO> {
        const userId = ID.create(dto.user_id);
        const productId = ID.create(dto.product_id);
        const product = await this.productRepository.findUnique(productId);
    
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND("Product", dto.product_id));
        }

        if (!product.getStock().isAvialable()) {
            throw new InsufficientStockError(ERROR.PRODUCT.OUT_OF_STOCK);
        }

        const existingCart = await this.cartRepository.getCartWithItems(userId);
        const cart = existingCart ?? Cart.create(dto.user_id);

        cart.addItem(productId, product.getPrice());

        const userCart = existingCart ?? Cart.create(dto.user_id);

        userCart.addItem(productId, product.getPrice());

        await this.cartRepository.saveChanges(userCart, existingCart);

        return this.mapper.toDTO(userCart);
    }
}