import { jest } from '@jest/globals';
import { mock } from 'jest-mock-extended';
import Cart from '../../../../domain/entities/cart';
import Money from '../../../../../../shared/domain/value-object/money-object';
import type ICartRepository from '../../../../domain/repository/cart.repository.interface';
import type { IQueryableProduct, QuerableProductResult } from '../../../../../../shared/domain/interfaces/queryable.product.interface';
import type CartItemResponseDTO from '../../../dtos/cart.item.response.dto';
import type IApplicationMapper from '../../../../../../shared/application/interfaces/application.mapper.interface';
import ID from '../../../../../../shared/domain/value-object/Id-object';

export const createMockProduct = (state: { isAvailable: boolean }): jest.Mocked<QuerableProductResult> => {
    return {
        isAvailable: jest.fn<() => boolean>().mockReturnValue(state.isAvailable),
        getPrice: jest.fn<() => Money>().mockReturnValue(Money.create(100)),
    }
}

export const createDTO = () => ({
    user_id: ID.generate().toString(),
    product_id: ID.generate().toString(),
});

export const createMockCartRepository = () => mock<ICartRepository>();

export const mockDTO: CartItemResponseDTO = {
    cart_total: 999,
    items_count: 99,
    items: [{ product_id: "mock", price: 0, quantity: 0, subtotal: 0 }]
};

export const createMockProductRepository = (): jest.Mocked<IQueryableProduct> => ({
    findUnique: jest.fn(),
});

export const createMockApplicationMapper = (): jest.Mocked<IApplicationMapper<Cart, CartItemResponseDTO>> => ({
    toDTO: jest.fn(),
});