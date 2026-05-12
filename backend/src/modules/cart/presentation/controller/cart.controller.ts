import type { RequestHandler } from "express";
import AddItemUseCase from "../../application/use-cases/add.item.to.cart.use.case";
import type CartItemResponseDTO from "../../application/dtos/cart.item.response.dto";
import DeleteItemUseCase from "../../application/use-cases/delete.item.from.cart.use.case";

export default class CartController {
    constructor (
        private addItemUseCase: AddItemUseCase,
        private deleteItemUseCase: DeleteItemUseCase
    ) {}

    addItem: RequestHandler = async (req, res, next) => {
        const payload = {
            user_id: req.user!.user_id,
            product_id: req.body.product_id
        }
    
        const result: CartItemResponseDTO = await this.addItemUseCase.execute(payload);

        res.status(200).json({
            status: "success",
            data: result
        })
    }

    removeItem: RequestHandler = async (req, res, next) => {
        const payload = {
            user_id: req.user!.user_id,
            product_id: req.params.product_id as string
        }
    
        const result: CartItemResponseDTO = await this.deleteItemUseCase.execute(payload);

        res.status(200).json({
            status: "success",
            data: result
        })
    }
}