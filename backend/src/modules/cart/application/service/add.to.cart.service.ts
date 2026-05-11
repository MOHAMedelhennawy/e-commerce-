import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import ERROR from "../../../../shared/domain/errors/error.messages";
import { InsufficientStockError, NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import type IProductRepository from "../../../product/domain/repositories/product-repository-interface"
import type CreateItemInputDTO from "../dtos/create.item.input.dto"
import type ICartRepository from "../../domain/repository/cart.repository.interface";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type CreateItemOutputDTO from "../dtos/create.item.output.dto";

export default class CartService {
    constructor(
        private cartRepository: ICartRepository,
        private productRepository: IProductRepository,
        private mapper: IApplicationMapper<Cart, CreateItemOutputDTO>
    ) {}

    async addItemToCart(dto: CreateItemInputDTO): Promise<CreateItemOutputDTO> {
        const productId = ID.create(dto.product_id);
        const product = await this.productRepository.findUnique(productId);
    
        if (!product) {
            throw new NotFoundError(ERROR.NOT_FOUND("Product", dto.product_id));
        }

        if (!product.getStock().isAvialable()) {
            throw new InsufficientStockError(ERROR.PRODUCT.OUT_OF_STOCK);
        }

        const userId = ID.create(dto.user_id);
        let userCart = await this.cartRepository.getCartWithItems(userId);

        if (!userCart)
            userCart = Cart.create(dto.user_id);

        userCart.addItem(productId, product.getPrice());

        await this.cartRepository.saveChanges(userCart);

        return this.mapper.toDTO(userCart);
    }
}