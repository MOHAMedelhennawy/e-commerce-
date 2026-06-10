import { expect, jest, beforeEach, test, describe } from '@jest/globals';
import ID from '../../../../../shared/domain/value-object/Id-object';
import Cart from '../../../domain/entities/cart';
import AddItemToCartUseCase from '../add.item.to.cart.use.case';
import { createMockApplicationMapper, createMockCartRepository, mockDTO, createMockProductRepository, createMockProduct, createDTO } from './mocks/cart.mocks';
import { InsufficientStockError, NotFoundError, ValidationError } from '../../../../../shared/domain/errors/domain.errors';
import Money from '../../../../../shared/domain/value-object/money-object';
import type ICartRepository from '../../../domain/repository/cart.repository.interface';
import type { IQueryableProduct } from '../../../../../shared/domain/interfaces/queryable.product.interface';
import type IApplicationMapper from '../../../../../shared/application/interfaces/application.mapper.interface';
import type CartItemResponseDTO from '../../dtos/cart.item.response.dto';
import type CartItemInputDTO from '../../dtos/cart.item.input.dto';

let addItemUseCase: AddItemToCartUseCase;
let mockCartRepository: jest.Mocked<ICartRepository>;
let mockProductRepository: jest.Mocked<IQueryableProduct>;
let mockApplicationMapper: jest.Mocked<IApplicationMapper<Cart, CartItemResponseDTO>>;
let dto: CartItemInputDTO;

beforeEach(() => {
    mockCartRepository = createMockCartRepository();
    mockProductRepository = createMockProductRepository();
    mockApplicationMapper = createMockApplicationMapper();
    dto = createDTO();

    addItemUseCase = new AddItemToCartUseCase(mockCartRepository, mockProductRepository, mockApplicationMapper);
})

describe("AddItemToCartUseCase.execute", () => {
    test("should return cart DTO when cart already exists for user", async () => {
        const existingCart = Cart.create(dto.user_id);
        mockProductRepository.findUnique.mockResolvedValue(createMockProduct({ isAvailable: true }));
        mockCartRepository.getCartWithItems.mockResolvedValue(existingCart);
        mockApplicationMapper.toDTO.mockReturnValue(mockDTO);
        
        const result = await addItemUseCase.execute(dto);
    
        expect(mockCartRepository.save).toHaveBeenCalledWith(existingCart);
        expect(mockApplicationMapper.toDTO).toHaveBeenCalledWith(existingCart);
        expect(result).toEqual(mockDTO);
    })
    
    test("should create a new cart when no existing cart is found", async () => {
        mockProductRepository.findUnique.mockResolvedValue(createMockProduct({ isAvailable: true }));
        mockCartRepository.getCartWithItems.mockResolvedValue(undefined);
        mockApplicationMapper.toDTO.mockReturnValue(mockDTO);
    
        const result = await addItemUseCase.execute(dto);
    
        expect(mockCartRepository.save).toHaveBeenCalledWith(expect.any(Cart));
        expect(mockApplicationMapper.toDTO).toHaveBeenCalledWith(expect.any(Cart));
        expect(result).toEqual(mockDTO);
    });
    
    test("should throw NotFoundError when product does not exist", async () => {
        mockProductRepository.findUnique.mockResolvedValue(undefined);
        await expect(addItemUseCase.execute(dto)).rejects.toThrow(NotFoundError);
    });
    
    test("should throw InsufficientStockError when product is out of stock", async () => {
        mockProductRepository.findUnique.mockResolvedValue(createMockProduct({ isAvailable: false }));
        await expect(addItemUseCase.execute(dto)).rejects.toThrow(InsufficientStockError);
    });

    test("should increment quantity when product already exists in cart", async () => {
        const existingCart = Cart.create(dto.user_id);
        const productId = ID.create(dto.product_id);
        existingCart.addItem(productId, Money.create(100));

        mockProductRepository.findUnique.mockResolvedValue(createMockProduct({ isAvailable: true }));
        mockCartRepository.getCartWithItems.mockResolvedValue(existingCart);
        mockApplicationMapper.toDTO.mockReturnValue(mockDTO);

        await addItemUseCase.execute(dto);

        const savedCart = mockCartRepository.save.mock.calls[0][0];
        const items = Array.from(savedCart.getItems().values());
        expect(items).toHaveLength(1);
        expect(items[0].getQuantity()).toBe(2);
    });

    test("should propagate error when cart repository fails", async () => {
        const dbError = new Error("Database connection failed");
        mockProductRepository.findUnique.mockResolvedValue(createMockProduct({ isAvailable: true }));
        mockCartRepository.getCartWithItems.mockRejectedValue(dbError);

        await expect(addItemUseCase.execute(dto)).rejects.toThrow(dbError);
    });
});
