import { describe, it, expect, beforeEach } from "@jest/globals";
import { Inventory } from "../../../models/Inventory";
import { Product } from "../../../models/Product";
import { ProductSpec } from "../../../models/ProductSpec";
import { ERRORS } from "../../../constants/errors";

function withdrawMultipleTimes(inventory: Inventory, id: string, times: number) {
    for (let i = 0; i < times; i++) inventory.withdraw(id);
}

describe("Inventory constructor", () => {
    it("should create an inventory with zero quantity for unknown ids", () => {
        const inventory = new Inventory();
        expect(inventory).toBeInstanceOf(Inventory);
        expect(inventory.getQuantity("any-id")).toBe(0);
    });
});

describe("Inventory.add", () => {
    let inventory: Inventory;
    let product: Product;
    let id: string;

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product("p1", new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should add a product with the given quantity", () => {
        inventory.add(product, 5);
        expect(inventory.getProduct(id)).toBe(product);
        expect(inventory.getQuantity(id)).toBe(5);
    });

    it("should accumulate quantity when adding the same product multiple times", () => {
        inventory.add(product, 0);
        inventory.add(product, 10);
        inventory.add(product, 3);
        expect(inventory.getQuantity(id)).toBe(13);
    });

    it("should throw MISSING_PRODUCT when the product argument is null", () => {
        expect(() => inventory.add(null as any, 5)).toThrow(ERRORS.MISSING_PRODUCT);
    });

    it("should throw INVALID_PRODUCT when the product argument is not a Product", () => {
        expect(() => inventory.add({} as any, 5)).toThrow(ERRORS.INVALID_PRODUCT);
    });

    it.each([
        ["null", null],
        ["a string", "4"],
        ["an object", {}],
        ["undefined", undefined],
    ])(
        "should throw INVALID_QUANTITY when quantity is %s",
        (_label, quantity) => {
            expect(() => inventory.add(product, quantity as any)).toThrow(
                ERRORS.INVALID_QUANTITY,
            );
        },
    );

    it("should throw QUANTITY_BELOW_ZERO when quantity is negative", () => {
        expect(() => inventory.add(product, -1)).toThrow(ERRORS.QUANTITY_BELOW_ZERO);
    });

    it.each([
        ["NaN", NaN],
        ["positive infinity", Number.POSITIVE_INFINITY],
        ["negative infinity", Number.NEGATIVE_INFINITY],
    ])("should throw an error when quantity is %s", (_label, specialNumber) => {
        expect(() => inventory.add(product, specialNumber)).toThrow(ERRORS.INVALID_QUANTITY);
    });
});

describe("Inventory.increaseQuantity", () => {
    let inventory: Inventory;
    let product: Product;
    let id: string;

    const UNKNOWN_ID = "any-id";

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product("p1", new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should increase the quantity by one", () => {
        inventory.add(product, 10);
        inventory.increaseQuantity(id);
        expect(inventory.getQuantity(id)).toBe(11);
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a number", 5],
        ["an object", {}],
    ])("should throw INVALID_ID when id is %s", (_label, badId) => {
        expect(() => inventory.increaseQuantity(badId as any)).toThrow(ERRORS.INVALID_ID);
    });

    it.each([
        ["an empty string", ""],
        ["a whitespace string", "      "],
    ])("should throw MISSING_ID when id is %s", (_label, blankId) => {
        expect(() => inventory.increaseQuantity(blankId)).toThrow(ERRORS.MISSING_ID);
    });

    it("should throw PRODUCT_NOT_FOUND when the product id does not exist", () => {
        expect(() => inventory.increaseQuantity(UNKNOWN_ID)).toThrow(
            ERRORS.PRODUCT_NOT_FOUND,
        );
    });
});

describe("Inventory.withdraw", () => {
    let inventory: Inventory;
    let product: Product;
    let id: string;

    const UNKNOWN_ID = "any-id";

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product("p1", new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should decrease the quantity by one", () => {
        inventory.add(product, 5);
        inventory.withdraw(id);
        expect(inventory.getQuantity(id)).toBe(4);
    });

    it("should decrease the quantity by one for each withdraw call", () => {
        inventory.add(product, 5);
        withdrawMultipleTimes(inventory, id, 3);
        expect(inventory.getQuantity(id)).toBe(2);
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a number", 5],
        ["an object", {}],
    ])("should throw INVALID_ID when id is %s", (_label, badId) => {
        expect(() => inventory.withdraw(badId as any)).toThrow(ERRORS.INVALID_ID);
    });

    it.each([
        ["an empty string", ""],
        ["a whitespace string", "      "],
    ])("should throw MISSING_ID when id is %s", (_label, blankId) => {
        expect(() => inventory.withdraw(blankId)).toThrow(ERRORS.MISSING_ID);
    });

    it("should throw PRODUCT_NOT_FOUND when the product id does not exist", () => {
        expect(() => inventory.withdraw(UNKNOWN_ID)).toThrow(ERRORS.PRODUCT_NOT_FOUND);
    });

    it("should throw PRODUCT_OUT_OF_STOCK when withdrawing more than the available quantity", () => {
        inventory.add(product, 2);
        expect(() => withdrawMultipleTimes(inventory, id, 3)).toThrow(
            ERRORS.PRODUCT_OUT_OF_STOCK,
        );
    });

    it("should throw PRODUCT_OUT_OF_STOCK when withdrawing from a product with zero quantity", () => {
        inventory.add(product, 0);
        expect(() => inventory.withdraw(id)).toThrow(ERRORS.PRODUCT_OUT_OF_STOCK);
    });
});

describe("Inventory.getQuantity", () => {
    let inventory: Inventory;
    let product: Product;
    let id: string;

    const UNKNOWN_ID = "any-id";

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product("p1", new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should return the stored quantity for an existing product id", () => {
        inventory.add(product, 5);
        expect(inventory.getQuantity(id)).toBe(5);
    });

    it("should return 0 for an unknown product id", () => {
        expect(inventory.getQuantity(UNKNOWN_ID)).toBe(0);
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a number", 5],
        ["an object", {}],
    ])("should throw INVALID_ID when id is %s", (_label, badId) => {
        expect(() => inventory.getQuantity(badId as any)).toThrow(ERRORS.INVALID_ID);
    });

    it.each([
        ["an empty string", ""],
        ["a whitespace string", "  "],
    ])("should throw MISSING_ID when id is %s", (_label, blankId) => {
        expect(() => inventory.getQuantity(blankId)).toThrow(ERRORS.MISSING_ID);
    });
});

describe("Inventory.getProduct", () => {
    let inventory: Inventory;
    let product: Product;
    let id: string;

    const UNKNOWN_ID = "any-id";

    beforeEach(() => {
        inventory = new Inventory();
        product = new Product("p1", new ProductSpec("Bluetooth Speaker", 85));
        id = product.getId();
    });

    it("should return the stored product for an existing product id", () => {
        inventory.add(product, 7);
        expect(inventory.getProduct(id)).toBe(product);
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a number", 5],
        ["an object", {}],
    ])("should throw INVALID_ID when id is %s", (_label, badId) => {
        expect(() => inventory.getProduct(badId as any)).toThrow(ERRORS.INVALID_ID);
    });

    it.each([
        ["an empty string", ""],
        ["a whitespace string", "  "],
    ])("should throw MISSING_ID when id is %s", (_label, blankId) => {
        expect(() => inventory.getProduct(blankId)).toThrow(ERRORS.MISSING_ID);
    });

    it("should throw PRODUCT_NOT_FOUND when the product id does not exist", () => {
        expect(() => inventory.getProduct(UNKNOWN_ID)).toThrow(ERRORS.PRODUCT_NOT_FOUND);
    });
});