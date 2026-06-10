import {describe, expect, test, afterAll, beforeAll, afterEach} from '@jest/globals';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../../generated/prisma/client';
import CartRepository from './cart.repository';
import CartMapper from '../mappers/cart.mapper';
import ID from '../../../../shared/domain/value-object/Id-object';
import Cart from '../../domain/entities/cart';
import Money from '../../../../shared/domain/value-object/money-object';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const mapper = new CartMapper();
const repository = new CartRepository(prisma.carts, mapper);

beforeAll(async () => {
    await prisma.$connect();
})

afterAll(async () => {
    await prisma.$disconnect();
})

afterEach(async () => {
    await prisma.cart_items.deleteMany();
    await prisma.carts.deleteMany();
    await prisma.users.deleteMany();
    await prisma.product.deleteMany();
})

const TEST_USER_ID = 'c3ffae96-a738-49c3-a97e-e941f4939614';
const TEST_PRODUCT_ID_1 = '5640c476-5362-4ba6-8004-75624842038e';
const TEST_PRODUCT_ID_2 = 'e4c7de99-237a-468c-b618-05bec939083f';
const TEST_PRODUCT_ID_3 = '5daecb89-0ca5-4435-863f-479513334916';

async function seedUser() {
    return prisma.users.create({
        data: {
            id: TEST_USER_ID,
            name: 'Test User',
            email: 'test@test.com',
            password: 'hashedpassword',
            role: 'USER',
        }
    });
}

async function seedCart(user_id: string) {
    return prisma.carts.create({
        data: {
            user_id: user_id
        }
    })
}

async function seedProducts() {
    const ids = [TEST_PRODUCT_ID_1, TEST_PRODUCT_ID_2, TEST_PRODUCT_ID_3];

    return await Promise.all(
        ids.map((id, i) => {
            return prisma.product.create({
                data: {
                    id: id,
                    title: `product_test ${i + 1}`,
                    price: (400 * i) + 1,
                    stock: i + 1,
                }
            });
        })
    );
}

describe('CartRepository', () => {
    describe('getCartWithItems', () => {
        test('should return undefined when cart does not exist', async () => {
            const userId = ID.reconstitute(TEST_USER_ID);
            const result = await repository.getCartWithItems(userId);
            expect(result).toBeUndefined();
        });

        test(`should return the exist cart`, async () => {
            const user = await seedUser();
            const cart = await seedCart(user.id);
            const userId = ID.reconstitute(user.id);

            const result = await repository.getCartWithItems(userId);
            expect(result).toBeInstanceOf(Cart);
            expect(result?.getId().toString()).toBe(cart.id)
        });
    });

    describe('save', () => { 
        test('should save the new cart', async () => {
            const user = await seedUser();
            const cart = Cart.create(user.id);
            const userId = ID.reconstitute(user.id);

            let result = await repository.getCartWithItems(userId);
            expect(result).toBeUndefined();

            await repository.save(cart);
            result = await repository.getCartWithItems(userId);
            expect(result).toBeInstanceOf(Cart);
            expect(result?.count()).toBe(0);
            expect(result?.getId().toString()).toBe(cart.getId().toString())
            expect(result?.getUserId().toString()).toBe(cart.getUserId().toString())
        });

        test('should add new item to existing cart', async () => {
            const [product_1] = await seedProducts();
            const user = await seedUser();
            const cart = Cart.create(user.id);
            const userId = ID.reconstitute(user.id);

            await repository.save(cart);

            cart.addItem(
                ID.reconstitute(product_1.id),
                Money.reconstitute(Number(product_1.price))
            )

            await repository.save(cart);
            const updatedCart = await repository.getCartWithItems(userId);
            const item = updatedCart?.getItem(ID.reconstitute(product_1.id))

            expect(updatedCart?.count()).toEqual(1);
            expect(item).toBeDefined();
            expect(item?.getQuantity()).toEqual(1);            
        });

        test('should update item quantity in existing cart', async () => {
            const [product_1] = await seedProducts();
            const productId = ID.reconstitute(product_1.id);
            const user = await seedUser();
            const cart = Cart.create(user.id);
            const userId = ID.reconstitute(user.id);

            await repository.save(cart);

            cart.addItem(
                ID.reconstitute(product_1.id),
                Money.reconstitute(Number(product_1.price))
            )

            await repository.save(cart);
            let updatedCart = await repository.getCartWithItems(userId);

            updatedCart?.addItem(
                productId,
                Money.reconstitute(Number(product_1.price))
            );

            await repository.save(updatedCart!);
            updatedCart = await repository.getCartWithItems(userId);
            expect(updatedCart?.count()).toEqual(1);
            expect(updatedCart?.getItem(productId)?.getQuantity()).toEqual(2);
        });

        test('should remove item from existing cart', async () => {
            const [product_1] = await seedProducts();
            const productId = ID.reconstitute(product_1.id);
            const user = await seedUser();
            const cart = Cart.create(user.id);
            const userId = ID.reconstitute(user.id);

            await repository.save(cart);

            cart.addItem(
                productId,
                Money.reconstitute(Number(product_1.price))
            )

            await repository.save(cart);
            let updatedCart = await repository.getCartWithItems(userId);
            expect(updatedCart?.count()).toEqual(1);

            updatedCart?.removeItem(productId);
            await repository.save(updatedCart!);
            updatedCart = await repository.getCartWithItems(userId);
            expect(updatedCart?.count()).toEqual(0);
        });
    })
});