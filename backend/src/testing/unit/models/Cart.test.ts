import { describe, it, expect, beforeEach } from "@jest/globals";
import { Cart } from "../../../models/Cart";
import { ERRORS } from "../../../constants/errors";
import { CartItem } from "../../../models/CartItem";
import { Product } from "../../../models/Product";
import { ProductSpec } from "../../../models/ProductSpec";

describe("Cart.getItem", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;
    const UNKNOWN_ID = "any-id";

    beforeEach(() => {
        cart = new Cart();
        productSpec = new ProductSpec("Laptop", 1500);
        product = new Product("p1", productSpec);
        cart.addItem(product);
    });

    it("should return the stored item for an existing item id", () => {
        const item = cart.getItem('p1');

        expect(item).toBeInstanceOf(CartItem);
        expect(item?.getProduct()).toBe(product);
        expect(item?.getQuantity()).toEqual(1);
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a number", 5],
        ["an object", {}],
    ])("should throw INVALID_ID when id is %s", (_label, badId) => {
        expect(() => cart.getItem(badId as any)).toThrow(ERRORS.INVALID_ID);
    });

    it.each([
        ["an empty string", ""],
        ["a whitespace string", "  "],
    ])("should throw an MISSING_ID when id is %s", (_label, badId) => {
        expect(() => cart.getItem(badId)).toThrow(ERRORS.MISSING_ID);
    });

    it("should return null when cart item id does not exist", () => {
        expect(cart.getItem(UNKNOWN_ID)).toBeNull()
    });

    it("should return a clone, not the original item", () => {
        const item1 = cart.getItem('p1');
        const item2 = cart.getItem('p1');

        expect(item1).not.toBe(item2);
        expect(item1?.getProduct()).toBe(item2?.getProduct());
    })
});

describe("Cart.getAllItems", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;

    beforeEach(() => {
        cart = new Cart();
        
        for (let i = 1; i < 5; i++) {
            productSpec = new ProductSpec(`Laptop${i}`, 500 * i);
            product = new Product(`p${i}`, productSpec);
            cart.addItem(product);
        }
    });

    it("should return all the 4 items that stored in cart", () => {
        expect(cart.getAllItems().length).toEqual(4);
    });

    it("should return a array of clone of items, not the original items", () => {
        const collection1 = cart.getAllItems();
        const collection2 = cart.getAllItems();

        for (let i = 0; i < collection1.length; i++) {
            expect(collection1[i]).not.toBe(collection2[i]);
        }
    });

    it("should return array of CartItem class", () => {
        const items = cart.getAllItems();
        expect(items.every(e => e instanceof CartItem)).toBeTruthy();;
    });

    it("should return empty array when cart is empty", () => {
        const cart = new Cart();
        expect(cart.getAllItems()).toStrictEqual([]);
    });
});

describe("Cart.addItem", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;
    
    beforeEach(() => {
        cart = new Cart();
        productSpec = new ProductSpec("Laptop", 1500);
        product = new Product("p1", productSpec);
    });

    it("should add a product to the cart", () => {
        expect(cart.addItem(product)).toBeTruthy()
        expect(cart.getAllItems().length).toEqual(1);
        expect(cart.getItem(product.getId())).toBeInstanceOf(CartItem);
    });

    it("should increase its quantity by one every time added if already exist", () => {
        cart.addItem(product);

        const id = product.getId();
        expect(cart.addItem(product)).toBeFalsy();
        expect(cart.addItem(product)).toBeFalsy();

        expect(cart.getAllItems().length).toEqual(1);
        expect(cart.getItem(id)?.getQuantity()).toEqual(3);
    });

    it.each([
        ["null", null],
        ["undefined", undefined]
    ])("should throw MISSING_PRODUCT when product arguments is %s", (_label, badProduct) => {
        expect(() => cart.addItem(badProduct as any))
            .toThrow(ERRORS.MISSING_PRODUCT);
    });

    it.each([
        ["a string", "4"],
        ["an object", {}],
        ["Cart", Cart]
    ])("should throw INVALID_PRODUCT when product is %s", (_label, badProduct) => {
        expect(() => cart.addItem(badProduct as any))
            .toThrow(ERRORS.INVALID_PRODUCT);
    });
});

describe("Cart.removeItem", () => {

});

describe("Cart.calculateTotalCost", () => {

});