import type { RequestHandler } from "express";
import CartService from "../../application/service/add.to.cart.service";
import type CreateItemOutputDTO from "../../application/dtos/create.item.output.dto";

export default class CartController {
    constructor (private service: CartService) {}

    addItem: RequestHandler = async (req, res, next) => {
        const payload = req.body;
        const user = req.user!;

        const result: CreateItemOutputDTO = await this.service.addItemToCart({ user_id: user.user_id, product_id: payload.product_id });

        res.status(200).json({
            status: "success",
            data: result
        })
    }
}