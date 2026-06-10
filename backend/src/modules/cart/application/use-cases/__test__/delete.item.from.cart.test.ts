import { expect, jest, beforeEach, test, describe } from '@jest/globals';
import Cart from '../../../domain/entities/cart';
import DeleteItemUseCase from '../delete.item.from.cart.use.case';
import type ICartRepository from '../../../domain/repository/cart.repository.interface';
import type IApplicationMapper from '../../../../../shared/application/interfaces/application.mapper.interface';
import type CartItemResponseDTO from '../../dtos/cart.item.response.dto';
import type CartItemInputDTO from '../../dtos/cart.item.input.dto';
import { createDTO, createMockApplicationMapper, createMockCartRepository, mockDTO } from './mocks/cart.mocks';
import { NotFoundError } from '../../../../../shared/domain/errors/domain.errors';
import ID from '../../../../../shared/domain/value-object/Id-object';
import Money from '../../../../../shared/domain/value-object/money-object';

describe("DeleteItemUseCase", () => {
    let deleteItemUseCase: DeleteItemUseCase;
    let mockCartRepository: jest.Mocked<ICartRepository>;
    let mockApplicationMapper: jest.Mocked<IApplicationMapper<Cart, CartItemResponseDTO>>;
    let dto: CartItemInputDTO;

    beforeEach(() => {
        mockCartRepository = createMockCartRepository();
        mockApplicationMapper = createMockApplicationMapper();
        dto = createDTO();

        deleteItemUseCase = new DeleteItemUseCase(mockCartRepository, mockApplicationMapper);
    })

    describe("execute", () => {
        test("should delete item from cart if quantity = 1", async () => {
            const cart = Cart.create(dto.user_id);
            cart.addItem(ID.create(dto.product_id), Money.create(500));

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);
            mockApplicationMapper.toDTO.mockReturnValue(mockDTO);

            const result = await deleteItemUseCase.execute(dto);

            expect(mockCartRepository.save).toHaveBeenCalledTimes(1);
            expect(mockCartRepository.save).toHaveBeenCalledWith(cart);
            expect(cart.count()).toEqual(0);
            expect(result).toEqual(mockDTO);
        });
        test("should decrease item quantity if quantity > 1", async () => {
            const cart = Cart.create(dto.user_id);
            const productId = ID.create(dto.product_id);

            for (let i = 0; i < 4; i++) {
                cart.addItem(productId, Money.create(500));
            }

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);
            mockApplicationMapper.toDTO.mockReturnValue(mockDTO);

            const result = await deleteItemUseCase.execute(dto);

            expect(mockCartRepository.save).toHaveBeenCalledTimes(1);
            expect(mockCartRepository.save).toHaveBeenCalledWith(cart);
            expect(cart.count()).toEqual(1);
            expect(Array.from(cart.getItems().values())[0].getQuantity()).toEqual(3);
            expect(result).toEqual(mockDTO);
        });
        test("should throw NotFoundError when user cart not found", async () => {
            mockCartRepository.getCartWithItems.mockResolvedValue(undefined);
            await expect(deleteItemUseCase.execute(dto)).rejects.toThrow(NotFoundError);
        });
        test("should throw NotFoundError when product is not in the cart", async () => {
            const cart = Cart.create(dto.user_id);
            cart.addItem(ID.create(dto.product_id), Money.create(500));
            const badDto = { product_id: ID.generate().toString(), user_id: dto.user_id };

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);
            await expect(deleteItemUseCase.execute(badDto)).rejects.toThrow(NotFoundError);
        });
        test("should propagate error when cartRepository.getCartWithItems fails", async () => {
            const dbError = new Error("Database connection failed");
            mockCartRepository.getCartWithItems.mockRejectedValue(dbError);
            await expect(deleteItemUseCase.execute(dto)).rejects.toThrow(dbError);
        });
        test("should propagate error when cartRepository.save fails", async () => {
            const dbError = new Error("Database connection failed");
            const cart = Cart.create(dto.user_id);
            cart.addItem(ID.create(dto.product_id), Money.create(500));

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);
            mockCartRepository.save.mockRejectedValue(dbError);

            await expect(deleteItemUseCase.execute(dto)).rejects.toThrow(dbError);
        });
        test("should call cartRepository.save with the modified cart entity after removal", async () => {
            const cart = Cart.create(dto.user_id);
            cart.addItem(ID.create(dto.product_id), Money.create(500));

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);

            await deleteItemUseCase.execute(dto);

            expect(mockCartRepository.save).toHaveBeenCalledTimes(1);
            expect(mockCartRepository.save).toHaveBeenCalledWith(cart);
        });
        test("should call mapper.toDTO with the saved cart", async () => {
            const cart = Cart.create(dto.user_id);
            cart.addItem(ID.create(dto.product_id), Money.create(500));

            mockCartRepository.getCartWithItems.mockResolvedValue(cart);

            await deleteItemUseCase.execute(dto);

            expect(mockApplicationMapper.toDTO).toHaveBeenCalledTimes(1);
            expect(mockApplicationMapper.toDTO).toHaveBeenCalledWith(cart);
        });
    })
});
