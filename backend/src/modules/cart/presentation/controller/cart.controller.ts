import type { RequestHandler } from "express";
import AddItemUseCase from "../../application/use-cases/add.item.to.cart.use.case";
import type CreateItemOutputDTO from "../../application/dtos/create.item.output.dto";

export default class CartController {
    constructor (private service: AddItemUseCase) {}

    addItem: RequestHandler = async (req, res, next) => {
        const payload = req.body;
        const user = req.user!;

        const result: CreateItemOutputDTO = await this.service.execute({ user_id: user.user_id, product_id: payload.product_id });

        res.status(200).json({
            status: "success",
            data: result
        })
    }
}