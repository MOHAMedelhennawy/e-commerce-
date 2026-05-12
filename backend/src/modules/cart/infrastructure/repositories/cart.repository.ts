import ID from "../../../../shared/domain/value-object/Id-object";
import Cart from "../../domain/entities/cart";
import CartItem from "../../domain/entities/cart.item";
import { prisma } from "../../../../infrastructure/database/prisma";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import type ICartRepository from "../../domain/repository/cart.repository.interface";
import type { CartWithItemsRow } from "../types/cart.with.items.row";
import type IPersistencMapper from "../../../../shared/infrastructure/interfaces/persistenc.mapper.interface";
import type { CartItemRow } from "../types/cart.with.items.row";

type CartDelegate = PrismaClient["carts"]

export default class CartRepository implements ICartRepository {
    constructor (
        private model: CartDelegate,
        private mapper: IPersistencMapper<Cart, CartWithItemsRow>
    ) {}

    async getCartWithItems(userId: ID): Promise<Cart | undefined> {
        const row: CartWithItemsRow | null = await this.model.findUnique({
            where: { user_id: userId.toString() },
            include: { cart_items: true }
        })

        if (!row) return undefined;

        return this.mapper.toDomain(row);
    }

    async saveChanges(updatedCart: Cart, existingCart: Cart | undefined): Promise<void> {
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
        })
        
    }

    private async createCart(tx: Prisma.TransactionClient, cart: Cart): Promise<void> {
        const data = this.mapper.toPersistence(cart);

        await tx.carts.create({
            data: {
                ...data,
                cart_items: {
                    createMany: { data: data.cart_items }
                }
            }
        })
    }

    private mergeItemIds(existingCart: Cart, updatedCart: Cart): Set<string> {
        return new Set([...existingCart.getItems().keys(), ...updatedCart.getItems().keys()])
    }

    private async addCartItem(tx: Prisma.TransactionClient, cartId: ID, items: CartItemRow[]) {
        if (items.length > 0) {
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
    }

    private async deleteCartItems(tx: Prisma.TransactionClient, ids: string[]): Promise<void> {
        if (ids.length > 0) {
            await tx.cart_items.deleteMany({    
                where: {
                    id: {
                        in: ids
                    }
                }
            })
        }
    }

    private async updateCartItems(tx: Prisma.TransactionClient, items: CartItemRow[]) {
        if (items.length > 0) {
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
                    this.itemToPersistence(productId, incomingItem)
                )
            } else if (existingItem && incomingItem) {
                itemsToUpdate.push(
                    this.itemToPersistence(productId, incomingItem)
                );
            }
        }

        return {
            removedItemIds,
            itemsToAdd,
            itemsToUpdate
        }
    }

    private itemToPersistence(productId: ID, item: CartItem): CartItemRow {
        return {
            id: item.getId().toString(),
            product_id: productId.toString(),
            quantity: item.getQuantity(),
            price: item.getPrice().toDecimal()
        }
    }
}