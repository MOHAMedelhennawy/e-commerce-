import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../../cart/domain/entities/cart";
import Order from "../../domain/entities/order";
import Product from "../../../product/domain/entities/product";
import CartItem from "../../../cart/domain/entities/cart.item";
import ERROR from "../../../../shared/domain/errors/error.messages";
import OrderItem from "../../domain/entities/order.items";
import { NotFoundError } from "../../../../shared/domain/errors/domain.errors";
import type OrderInputDTO from "../dtos/order.input.dto"
import type IOrderRepository from "../../domain/repository/order.repository.interface";
import type ICartRepository from "../../../cart/domain/repository/cart.repository.interface";
import type IProductRepository from "../../../product/domain/repositories/product-repository-interface";

export default class CheckoutUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private cartRepository: ICartRepository,
        private productRepository: IProductRepository
    ){}

    async execute(dto: OrderInputDTO): Promise<void> {
        const userId = ID.create(dto.userId);
        const existingCart = await this.cartRepository.getCartWithItems(userId);

        if (!existingCart || existingCart.isEmpty()) {
            throw new NotFoundError(ERROR.CART.NOT_FOUND);
        }

        const { orderItems, productIds } = this.mapCartItemsToOrderItems(existingCart);
        const products = await this.productRepository.findManyByIds(productIds);

        this.decreaseFromProductsStock(products, existingCart);

        const updatedCart = existingCart.clone();
        updatedCart.clear();

        // It should to be unit of work
        this.orderRepository.saveOrder(Order.create(userId, orderItems), updatedCart, products);
    }

    private mapCartItemsToOrderItems(cart: Cart) {
        const orderItems: OrderItem[] = [];
        const productIds: ID[] = []

        cart.getItems().forEach(
            (item: CartItem, key: string) => {
                orderItems.push(
                    OrderItem.create(
                        item.getPrice(),
                        item.getQuantity(),
                        ID.reconstitute(key),
                    )
                )
            
                productIds.push(ID.reconstitute(key));
            }
        )

        return { orderItems, productIds };
    }

    private decreaseFromProductsStock(products: Product[], cart: Cart) {

        products.forEach(
            product => {
                const existingItem = cart.getItem(product.getId());

                if (!existingItem) {
                    throw new NotFoundError(ERROR.CART.NOT_FOUND);
                }

                product.decreaseStock(existingItem.getQuantity())
            }
        )
    }
}