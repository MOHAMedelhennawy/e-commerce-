import { describe, expect, test } from '@jest/globals';
import CartItem from "../cart.item";
import Money from '../../../../../shared/domain/value-object/money-object';

describe("CartItem.increaseQuantity()", () => {
    test("should increase quantity by 1", () => {
        const item = CartItem.create(Money.create(40));
        item.increaseQuantity();
        expect(item.getQuantity()).toBe(2);
    });
});

describe("CartItem.decreaseQuantity()", () => {
    test("should decrease quantity by 1", () => {
        const item = CartItem.create(Money.create(40));
        item.increaseQuantity();
        item.decreaseQuantity();
        expect(item.getQuantity()).toBe(1);
    });
});

describe("CartItem.getTotal()", () => {
    test("should return price when quantity is 1", () => {
        const item = CartItem.create(Money.create(40));
        expect(item.getTotal().toNumber()).toBe(40);
    });

    test("should return price * quantity", () => {
        const item = CartItem.create(Money.create(40));
        item.increaseQuantity();
        expect(item.getTotal().toNumber()).toBe(80);
    });
});