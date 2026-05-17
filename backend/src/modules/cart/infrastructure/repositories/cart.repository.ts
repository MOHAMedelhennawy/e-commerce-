import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import { prisma } from "../../../../infrastructure/database/prisma";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import type ICartRepository from "../../domain/repository/cart.repository.interface";
import type { CartWithItemsRow } from "../types/cart.with.items.row";
import type { CartItemRow } from "../types/cart.with.items.row";
import type ICartMapper from "../interfaces/cart.mapper.interface";

type CartDelegate = PrismaClient["carts"]

export default class CartRepository implements ICartRepository {
    constructor (
        private model: CartDelegate,
        private mapper: ICartMapper
    ) {}

    async getCartWithItems(userId: ID): Promise<Cart | undefined> {
        const row: CartWithItemsRow | null = await this.model.findUnique({
            where: { user_id: userId.toString() },
            include: { cart_items: true }
        })

        if (!row) return undefined;

        return this.mapper.toDomain(row);
    }

    async save(updatedCart: Cart): Promise<void> {
        const existingCart = await this.getCartWithItems(updatedCart.getUserId());

        await prisma.$transaction(async (tx) => {
            if (!existingCart) {
                await this.createCart(tx, updatedCart)
                return;
            }

            const {
                removedItemIds,
                itemsToUpdate,
                itemsToAdd
            } = this.computeChanges(existingCart, updatedCart);

            await this.deleteCartItems(tx, removedItemIds);
            await this.updateCartItems(tx, itemsToUpdate);
            await this.addCartItem(tx, existingCart.getId(), itemsToAdd);
        });
    }

    private async createCart(tx: Prisma.TransactionClient, cart: Cart): Promise<void> {
        const data = this.mapper.toPersistence(cart);
        // Use upsert instead of create to handle race condition:
        // two concurrent requests may both see existingCart = null
        // and attempt to create the same cart simultaneously.
        // upsert resolves the conflict atomically at the DB level.

        await tx.carts.upsert({
            where: { user_id: cart.getUserId().toString() },
            create: {
                user_id: cart.getUserId().toString(),
                cart_items: {
                    createMany: { data: data.cart_items }
                }
            },
            update: {
                cart_items: {
                    createMany: { data: data.cart_items },
                    // skipDuplicates: if two concurrent requests both see existingCart = null,
                    // the second request will hit the update branch after the first creates the cart.
                    // The item may already exist, so we skip it silently instead of throwing a conflict error.
                    skipDuplicates: true
                }
            }
        });
    }

    private async addCartItem(tx: Prisma.TransactionClient, cartId: ID, items: CartItemRow[]) {
        if (!items.length) {
            return;
        }

        for (const item of items) {
            await tx.cart_items.create({
                data: {
                    id: item.id,
                    cart_id: cartId.toString(),
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                }
            })
        }
    }

    private async deleteCartItems(tx: Prisma.TransactionClient, ids: string[]): Promise<void> {
        if (!ids.length) {
            return;
        }

        await tx.cart_items.deleteMany({    
            where: {
                id: { in: ids }
            }
        })
    }

    private async updateCartItems(tx: Prisma.TransactionClient, items: CartItemRow[]) {
        if (items.length <= 0) {
            return;
        }

        for (const item of items) {
            await tx.cart_items.update({
                where: { id: item.id },
                data: {
                    quantity: item.quantity,
                    price: item.price,
                }
            })
        }
    }


    private mergeItemIds(existingCart: Cart, updatedCart: Cart): Set<string> {
        return new Set([...existingCart.getItems().keys(), ...updatedCart.getItems().keys()])
    }

    private computeChanges(existingCart: Cart, updatedCart: Cart): {
        removedItemIds: string[];
        itemsToAdd: CartItemRow[];
        itemsToUpdate: CartItemRow[];
    } {
        const ids = this.mergeItemIds(existingCart, updatedCart);
        const removedItemIds: string[] = []
        const itemsToUpdate: CartItemRow[] = [];
        const itemsToAdd: CartItemRow[] = [];

        for (const id of ids) {
            const productId = ID.reconstitute(id);
            const existingItem = existingCart.getItem(productId);
            const incomingItem = updatedCart.getItem(productId);

            if (existingItem && !incomingItem) {
                removedItemIds.push(id)
            } else if (!existingItem && incomingItem) {
                itemsToAdd.push(
                    this.mapper.itemToPersistence(productId, incomingItem)
                )
            } else if (existingItem && incomingItem && existingItem.getQuantity() !== incomingItem.getQuantity()) {
                itemsToUpdate.push(
                    this.mapper.itemToPersistence(productId, incomingItem)
                );
            }
        }

        return {
            removedItemIds,
            itemsToAdd,
            itemsToUpdate
        }
    }
}