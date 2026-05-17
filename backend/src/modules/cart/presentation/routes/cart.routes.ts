import express from "express";
import CartController from "../controller/cart.controller";
import requireAuth from "../../../../presentation/middlewares/require.authentication.middleware"
import validate from "../../../../presentation/middlewares/validate.middleware"
import AddItemSchema from "../schemas/add.item.schema"
import IdSchema from "../../../../shared/application/dtos/id.schema"
import type ITokenService from "../../../user/application/interfaces/token.service.interface";

const CartRouter = (controller: CartController, tokenService: ITokenService) => {
    const router = express.Router();
    
    router.post("/item", requireAuth(tokenService), validate(AddItemSchema), controller.addItem);
    router.delete("/item/:product_id", requireAuth(tokenService), validate(IdSchema, "params"), controller.removeItem);

    return router;
}

export default CartRouter;