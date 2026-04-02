import { describe, it, expect, beforeEach } from "@jest/globals";
import { Inventory } from "../../../models/entities/Inventory.js";
import { Product } from "../../../models/entities/Product.js";
import { ProductSpec } from "../../../models/value-objects/ProductSpec.js";
import { ERRORS } from "../../../errors/constants/errors.js";
import type { Id } from "../../../models/value-objects/Id.js";
import { Id as IdClass } from "../../../models/value-objects/Id.js";
import {
    InsufficientStockError,
    NotFoundError,
    ValidationError,
} from "../../../errors/domain.errors.js";

function withdrawMultipleTimes(inventory: Inventory, id: Id, times: number) {
    for (let i = 0; i < times; i++) inventory.withdraw(id);
}

const UNKNOWN_PRODUCT_ID = new IdClass("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");

describe("Inventory constructor", () => {
    it("should create an inventory with zero quantity for unknown ids", () => {
        const inventory = new Inventory();
        expect(inventory).toBeInstanceOf(Inventory);
        expect(inventory.getQuantity(UNKNOWN_PRODUCT_ID)).toBe(0);
    });
});

describe("Inventory.addProduct", () => {
    let inventory: Inventory;
    let product: Product;
    let id: Id;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product(new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should add a product with the given quantity", () => {
        inventory.addProduct(product, 5);
        expect(inventory.getProduct(id)).toBe(product);
        expect(inventory.getQuantity(id)).toBe(5);
    });

    it("should accumulate quantity when adding the same product multiple times", () => {
        inventory.addProduct(product, 0);
        inventory.addProduct(product, 10);
        inventory.addProduct(product, 3);
        expect(inventory.getQuantity(id)).toBe(13);
    });

    it("should throw MISSING when the product argument is null", () => {
        const action = () => inventory.addProduct(null as unknown as Product, 5);
        expect(action).toThrow(ERRORS.PRODUCT.MISSING);
        expect(action).toThrow(ValidationError);
    });

    it("should throw INVALID when the product argument is not a Product", () => {
        const action = () => inventory.addProduct({} as unknown as Product, 5);
        expect(action).toThrow(ERRORS.PRODUCT.INVALID);
        expect(action).toThrow(ValidationError);
    });

    it.each([
        ["null", null],
        ["a string", "4"],
        ["an object", {}],
        ["undefined", undefined],
    ])("should throw INVALID_QUANTITY when quantity is %s", (_label, quantity) => {
        const action = () => inventory.addProduct(product, quantity as never);
        expect(action).toThrow(ERRORS.INVALID_QUANTITY);
        expect(action).toThrow(ValidationError);
    });

    it("should throw QUANTITY_BELOW_ZERO when quantity is negative", () => {
        expect(() => inventory.addProduct(product, -1)).toThrow(
            ERRORS.QUANTITY_BELOW_ZERO,
        );
    });

    it.each([
        ["NaN", NaN],
        ["positive infinity", Number.POSITIVE_INFINITY],
        ["negative infinity", Number.NEGATIVE_INFINITY],
    ])("should throw INVALID_QUANTITY when quantity is %s", (_label, specialNumber) => {
        const action = () => inventory.addProduct(product, specialNumber);
        expect(action).toThrow(ERRORS.INVALID_QUANTITY);
        expect(action).toThrow(ValidationError);
    });
});

describe("Inventory.has", () => {
    it("should return false before the product is added and true after", () => {
        const inventory = new Inventory();
        const product = new Product(new ProductSpec("Item", 10));
        const id = product.getId();
        expect(inventory.hasProduct(id)).toBe(false);
        inventory.addProduct(product, 1);
        expect(inventory.hasProduct(id)).toBe(true);
    });
});

describe("Inventory.increaseQuantity", () => {
    let inventory: Inventory;
    let product: Product;
    let id: Id;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product(new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should increase the quantity by one", () => {
        inventory.addProduct(product, 10);
        inventory.increaseQuantity(id);
        expect(inventory.getQuantity(id)).toBe(11);
    });

    it("should throw NotFoundError when the product id does not exist", () => {
        expect(() => inventory.increaseQuantity(UNKNOWN_PRODUCT_ID)).toThrow(
            NotFoundError,
        );
        expect(() => inventory.increaseQuantity(UNKNOWN_PRODUCT_ID)).toThrow(
            ERRORS.PRODUCT.NOT_FOUND(UNKNOWN_PRODUCT_ID),
        );
    });
});

describe("Inventory.withdraw", () => {
    let inventory: Inventory;
    let product: Product;
    let id: Id;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product(new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should decrease the quantity by one", () => {
        inventory.addProduct(product, 5);
        inventory.withdraw(id);
        expect(inventory.getQuantity(id)).toBe(4);
    });

    it("should decrease the quantity by one for each withdraw call", () => {
        inventory.addProduct(product, 5);
        withdrawMultipleTimes(inventory, id, 3);
        expect(inventory.getQuantity(id)).toBe(2);
    });

    it("should throw NotFoundError when the product id does not exist", () => {
        expect(() => inventory.withdraw(UNKNOWN_PRODUCT_ID)).toThrow(NotFoundError);
        expect(() => inventory.withdraw(UNKNOWN_PRODUCT_ID)).toThrow(
            ERRORS.PRODUCT.NOT_FOUND(UNKNOWN_PRODUCT_ID),
        );
    });

    it("should throw InsufficientStockError when withdrawing more than available", () => {
        inventory.addProduct(product, 2);
        expect(() => withdrawMultipleTimes(inventory, id, 3)).toThrow(
            InsufficientStockError,
        );
        expect(() => withdrawMultipleTimes(inventory, id, 3)).toThrow(
            ERRORS.PRODUCT.OUT_OF_STOCK(id),
        );
    });

    it("should throw InsufficientStockError when withdrawing from zero quantity", () => {
        inventory.addProduct(product, 0);
        expect(() => inventory.withdraw(id)).toThrow(InsufficientStockError);
        expect(() => inventory.withdraw(id)).toThrow(ERRORS.PRODUCT.OUT_OF_STOCK(id));
    });
});

describe("Inventory.getQuantity", () => {
    let inventory: Inventory;
    let product: Product;
    let id: Id;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product(new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should return the stored quantity for an existing product id", () => {
        inventory.addProduct(product, 5);
        expect(inventory.getQuantity(id)).toBe(5);
    });

    it("should return 0 for an unknown product id", () => {
        expect(inventory.getQuantity(UNKNOWN_PRODUCT_ID)).toBe(0);
    });
});

describe("Inventory.getProduct", () => {
    let inventory: Inventory;
    let product: Product;
    let id: Id;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product(new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should return the stored product for an existing product id", () => {
        inventory.addProduct(product, 7);
        expect(inventory.getProduct(id)).toBe(product);
    });

    it("should throw NotFoundError when the product id does not exist", () => {
        expect(() => inventory.getProduct(UNKNOWN_PRODUCT_ID)).toThrow(NotFoundError);
        expect(() => inventory.getProduct(UNKNOWN_PRODUCT_ID)).toThrow(
            ERRORS.PRODUCT.NOT_FOUND(UNKNOWN_PRODUCT_ID),
        );
    });
});
