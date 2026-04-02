import { describe, it, expect, beforeEach } from "@jest/globals";
import { Cart } from "../../../models/entities/Cart.js";
import { ERRORS } from "../../../errors/constants/errors.js";
import { CartItem } from "../../../models/entities/CartItem.js";
import { Product } from "../../../models/entities/Product.js";
import { ProductSpec } from "../../../models/value-objects/ProductSpec.js";
import { NotFoundError, ValidationError } from "../../../errors/domain.errors.js";
import { Id } from "../../../models/value-objects/Id.js";

describe("Cart.getItem", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;
    let PRODUCT_ID: Id;
    const UNKNOWN_ID = new Id("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");

    beforeEach(() => {
        cart = new Cart();
        productSpec = new ProductSpec("Laptop", 1500);
        product = new Product(productSpec);
        PRODUCT_ID = product.getId();
        cart.addItem(product);
    });

    it("should return the stored item for an existing item id", () => {
        const item = cart.getItem(PRODUCT_ID);

        expect(item).toBeInstanceOf(CartItem);
        expect(item.getProduct()).toBe(product);
        expect(item.getQuantity()).toEqual(1);
    });

    it("should throw NotFoundError when cart item id does not exist", () => {
        const action = () => cart.getItem(UNKNOWN_ID);

        expect(action).toThrow(ERRORS.CART.ITEM_NOT_FOUND(UNKNOWN_ID));
        expect(action).toThrow(NotFoundError);
    });

    it("should return a clone, not the original item", () => {
        const item1 = cart.getItem(PRODUCT_ID);
        const item2 = cart.getItem(PRODUCT_ID);

        expect(item1).not.toBe(item2);
        expect(item1.getProduct()).toBe(item2.getProduct());
        expect(item1.getQuantity()).toBe(item2.getQuantity());
    });
});

describe("Cart.getAllItems", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;

    beforeEach(() => {
        cart = new Cart();

        for (let i = 1; i < 5; i++) {
            productSpec = new ProductSpec(`Laptop${i}`, 500 * i);
            product = new Product(productSpec);
            cart.addItem(product);
        }
    });

    it("should return all four distinct products stored in the cart", () => {
        expect(cart.getAllItems().length).toEqual(4);
    });

    it("should return arrays of clones, not the original item instances", () => {
        const collection1 = cart.getAllItems();
        const collection2 = cart.getAllItems();

        for (let i = 0; i < collection1.length; i++) {
            expect(collection1[i]).not.toBe(collection2[i]);
        }
    });

    it("should return only CartItem instances", () => {
        const items = cart.getAllItems();
        expect(items.every((e) => e instanceof CartItem)).toBe(true);
    });

    it("should return an empty array when the cart is empty", () => {
        const emptyCart = new Cart();
        expect(emptyCart.getAllItems()).toStrictEqual([]);
    });
});

describe("Cart.addItem", () => {
    let cart: Cart;
    let product: Product;
    let productSpec: ProductSpec;
    let PRODUCT_ID: Id;

    beforeEach(() => {
        cart = new Cart();
        productSpec = new ProductSpec("Laptop", 1500);
        product = new Product(productSpec);
        PRODUCT_ID = product.getId();
    });

    it("should add a product to the cart", () => {
        expect(cart.addItem(product)).toBe(true);
        expect(cart.getAllItems().length).toEqual(1);
        expect(cart.getItem(PRODUCT_ID)).toBeInstanceOf(CartItem);
    });

    it("should increase quantity by one on each add when the product already exists", () => {
        expect(cart.addItem(product)).toBe(true);

        expect(cart.addItem(product)).toBe(false);
        expect(cart.addItem(product)).toBe(false);

        expect(cart.getAllItems().length).toEqual(1);
        expect(cart.getItem(PRODUCT_ID).getQuantity()).toEqual(3);
    });

    it.each([
        ["null", null],
        ["undefined", undefined],
    ])("should throw MISSING when product is %s", (_label, badProduct) => {
        expect(() => cart.addItem(badProduct as unknown as Product)).toThrow(
            ERRORS.PRODUCT.MISSING,
        );

        expect(() => cart.addItem(badProduct as unknown as Product)).toThrow(
            ValidationError,
        );
    });

    it.each([
        ["a string", "4"],
        ["an object", {}],
        ["Cart class", Cart],
    ])("should throw INVALID when product is %s", (_label, badProduct) => {
        expect(() => cart.addItem(badProduct as unknown as Product)).toThrow(
            ERRORS.PRODUCT.INVALID,
        );

        expect(() => cart.addItem(badProduct as unknown as Product)).toThrow(
            ValidationError,
        );
    });
});

describe("Cart.removeItem", () => {
    let cart: Cart;
    let product: Product;
    let id: Id;
    const UNKNOWN_ID = new Id("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");

    beforeEach(() => {
        cart = new Cart();
        product = new Product(new ProductSpec("Mouse", 25));
        id = product.getId();
        cart.addItem(product);
    });

    it("should remove the line when quantity is one", () => {
        expect(cart.removeItem(id)).toBe(true);
        expect(cart.hasItem(id)).toBe(false);
    });

    it("should decrease quantity when quantity is greater than one", () => {
        cart.addItem(product);
        cart.addItem(product);
        expect(cart.removeItem(id)).toBe(true);
        expect(cart.hasItem(id)).toBe(true);
        expect(cart.getItem(id).getQuantity()).toBe(2);
    });

    it("should throw NotFoundError when the id is not in the cart", () => {
        expect(() => cart.removeItem(UNKNOWN_ID)).toThrow(NotFoundError);
        expect(() => cart.removeItem(UNKNOWN_ID)).toThrow(
            ERRORS.CART.ITEM_NOT_FOUND(UNKNOWN_ID),
        );
    });
});

describe("Cart.hasItem", () => {
    it("should return false for an empty cart", () => {
        const cart = new Cart();
        const id = new Id("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");
        expect(cart.hasItem(id)).toBe(false);
    });

    it("should return true after adding the product", () => {
        const cart = new Cart();
        const product = new Product(new ProductSpec("Keyboard", 75));
        const id = product.getId();
        cart.addItem(product);
        expect(cart.hasItem(id)).toBe(true);
    });
});

describe("Cart.calculateTotalCost", () => {
    it("should return zero for an empty cart", () => {
        expect(new Cart().calculateTotalCost()).toBe(0);
    });

    it("should sum price times quantity for all lines", () => {
        const cart = new Cart();
        const a = new Product(new ProductSpec("A", 10));
        const b = new Product(new ProductSpec("B", 25));
        cart.addItem(a);
        cart.addItem(a);
        cart.addItem(b);
        expect(cart.calculateTotalCost()).toBe(10 + 10 + 25);
    });
});

describe("Cart.clearCart", () => {
    it("should remove all items", () => {
        const cart = new Cart();
        cart.addItem(new Product(new ProductSpec("X", 5)));
        cart.clearCart();
        expect(cart.getAllItems()).toStrictEqual([]);
        expect(cart.calculateTotalCost()).toBe(0);
    });
});
