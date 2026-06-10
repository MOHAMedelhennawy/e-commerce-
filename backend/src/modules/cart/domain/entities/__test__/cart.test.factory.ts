import Cart from "../cart";
import ID from "../../../../../shared/domain/value-object/Id-object";
import Money from "../../../../../shared/domain/value-object/money-object";

const DEFAULT_PRICE = 40;

export const createCart = (): Cart => Cart.create(ID.generate().toString());

export const aProductId = (): ID => ID.generate();

export const aMoney = (amount: number = DEFAULT_PRICE): Money => Money.create(amount);

export const addItem = (cart: Cart, price: number = DEFAULT_PRICE): ID => {
  const productId = ID.generate();
  cart.addItem(productId, Money.create(price));
  return productId;
};

export const addExistingItem = (cart: Cart, productId: ID, price: number = DEFAULT_PRICE): void => {
  cart.addItem(productId, Money.create(price));
};
