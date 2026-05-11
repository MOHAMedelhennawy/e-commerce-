import Cart from "../../domain/entities/cart";
import type CreateItemOutputDTO from "../dtos/create.item.output.dto";
import type IApplicationMapper from "../../../../shared/application/interfaces/application.mapper.interface";

export default class CartApplicationMapper implements IApplicationMapper<Cart, CreateItemOutputDTO> {
    toDTO(cart: Cart): CreateItemOutputDTO {
        return {
            cart_total: cart.calculateTotalCost().toNumber(),
            items_count: cart.count(),
            items: Array.from(cart.getItems().entries()).map(
                ([key, item]) => {
                    return {
                        product_id: key,
                        price: item.getPrice().toNumber(),
                        quantity: item.getQuantity(),
                        subtotal: item.getTotal().toNumber(),
                    }
                }
            )
        }
    }
}
