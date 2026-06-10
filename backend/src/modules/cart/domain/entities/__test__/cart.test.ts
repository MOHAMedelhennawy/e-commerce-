import {describe, expect, test} from '@jest/globals';
import Cart from "../cart";
import Money from '../../../../../shared/domain/value-object/money-object';
import { NotFoundError } from '../../../../../shared/domain/errors/domain.errors';
import { createCart, aProductId, addItem, addExistingItem } from "./cart.test.factory";

describe("Cart.addItem()", () => {
    test("should add item to cart", () => {
        const cart = createCart();
        const productId = addItem(cart);

        const item = cart.getItem(productId);

        expect(item).toBeTruthy();
        expect(item?.getQuantity()).toBe(1);
    });

    test("should add multiple items to cart", () => {
        const cart = createCart();

        addItem(cart);
        addItem(cart);

        expect(cart.count()).toEqual(2);
    })

    test("should updatedAt to be changed", () => {
        const cart = createCart();
        const timestamps = cart.getTimestamps();

        addItem(cart);

        const changedTimestamps = cart.getTimestamps();

        expect(timestamps.createdAt).toBe(changedTimestamps.createdAt);
        expect(timestamps.updatedAt).not.toBe(changedTimestamps.updatedAt);
    });

    test("should increase item quantity by 1", () => {
        const cart = createCart();

        const productId = addItem(cart);
        addExistingItem(cart, productId);

        const item = cart.getItem(productId);

        expect(item?.getQuantity()).toEqual(2)
    })
});

describe("Cart.removeItem()", () => {
    test("should remove item from cart", () => {
        const cart = createCart();

        const productId = addItem(cart);

        expect(cart.has(productId)).toBeTruthy();
        
        cart.removeItem(productId);

        expect(cart.has(productId)).toBeFalsy();
    })

    test("should to decrease item quantity", () => {
        const cart = createCart();

        const productId = addItem(cart);
        addExistingItem(cart, productId);

        expect(cart.has(productId)).toBeTruthy();
        expect(cart.getItem(productId)?.getQuantity()).toEqual(2);

        cart.removeItem(productId);
        expect(cart.has(productId)).toBeTruthy();
        expect(cart.getItem(productId)?.getQuantity()).toEqual(1);
    })

    test("should to throw an NotFoundError", () => {
        const cart = createCart();

        addItem(cart);

        expect(() => cart.removeItem(aProductId())).toThrow(NotFoundError)
    });

    test("should updatedAt to be changed", () => {
        const cart = createCart();
        const timestamps = cart.getTimestamps();

        const productId = addItem(cart);

        cart.removeItem(productId);
        const changedTimestamps = cart.getTimestamps();

        expect(timestamps.createdAt).toBe(changedTimestamps.createdAt);
        expect(timestamps.updatedAt).not.toBe(changedTimestamps.updatedAt);
    });
});

describe("Cart.calculateTotalCost()", () => {
    test("should return 0 when cart is empty", () => {
        const cart = createCart();
        expect(
            cart.calculateTotalCost().toNumber()
        ).toEqual(0)
    })

    test("should return item price", () => {
        const cart = createCart();
        const itemPrice = 40;
            
        cart.addItem(
            aProductId(),
            Money.create(itemPrice)
        );

        expect(
            cart.calculateTotalCost().toNumber()
        ).toEqual(itemPrice)
    });

    test("should return item price * quantity", () => {
        const cart = createCart();
        const itemPrice = 40;
        const productId = aProductId();
        const itemsQuantity = 5;

        for (let i = 0; i < itemsQuantity; i++) {
            cart.addItem(
                productId,
                Money.create(itemPrice)
            );
        }

        expect(
            cart.calculateTotalCost().toNumber()
        ).toEqual(itemPrice * itemsQuantity)
    })

    test("should return multible items cart total cost" , () => {
        const cart = createCart();
        const itemPrice1 = 40;
        const productId1 = aProductId();
        const itemsQuantity1 = 5;

        for (let i = 0; i < itemsQuantity1; i++) {
            cart.addItem(
                productId1,
                Money.create(itemPrice1)
            );
        }

        const itemPrice2 = 20;
        const productId2 = aProductId();
        const itemsQuantity2 = 2;

        for (let i = 0; i < itemsQuantity2; i++) {
            cart.addItem(
                productId2,
                Money.create(itemPrice2)
            );
        }

        expect(
            cart.calculateTotalCost().toNumber()
        ).toEqual(itemPrice1 * itemsQuantity1 + itemPrice2 * itemsQuantity2)
    })
})

describe("Cart.clear() and Cart.isEmpty()", () => {
    test("should return true when cart is empty", () => {
        const cart = createCart();
        expect(cart.isEmpty()).toBe(true);
    });

    test("should return false when cart has items", () => {
        const cart = createCart();
        addItem(cart);
        expect(cart.isEmpty()).toBe(false);
    });

    test("should clear all items from cart", () => {
        const cart = createCart();
        addItem(cart);
        addItem(cart, 60);

        cart.clear();

        expect(cart.count()).toBe(0);
        expect(cart.isEmpty()).toBe(true);
    });
});
