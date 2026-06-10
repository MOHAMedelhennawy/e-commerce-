import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import ERROR from "../../../../shared/domain/errors/error.messages";
import type ICartRepository from "../../domain/repository/cart.repository.interface"
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";
import type CartItemInputDTO from "../dtos/cart.item.input.dto";
import type CartItemResponseDTO from "../dtos/cart.item.response.dto";


export default class DeleteItemUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private mapper: IApplicationMapper<Cart, CartItemResponseDTO>
    ){}

    async execute(dto: CartItemInputDTO): Promise<CartItemResponseDTO> {
        const productId = ID.create(dto.product_id);
        const userId = ID.create(dto.user_id);

        if (!existingCart) throw new NotFoundError(ERROR.CART.NOT_FOUND)

        existingCart.removeItem(productId);
        await this.cartRepository.save(existingCart);
        return this.mapper.toDTO(existingCart);
    }
}