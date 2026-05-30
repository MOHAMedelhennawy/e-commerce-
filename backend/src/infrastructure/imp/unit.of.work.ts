import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../database/prisma";
import type IUnitOfWork from "../../shared/domain/interfaces/unit.of.work.interface";

export default class PrismaUnitOfWork implements IUnitOfWork<Prisma.TransactionClient> {
    async transaction(work: (tx: Prisma.TransactionClient) => Promise<void>): Promise<void> {
        await prisma.$transaction(async (tx) => {
            await work(tx);
        });
    }
}