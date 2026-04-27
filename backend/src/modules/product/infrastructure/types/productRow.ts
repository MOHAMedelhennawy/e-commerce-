import { Decimal } from "@prisma/client/runtime/client";

type ProductRow = {
    id: string;
    title: string;
    price: Decimal;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export default ProductRow;