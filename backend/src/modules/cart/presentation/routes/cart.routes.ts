import express from "express";
import CartController from "../controller/cart.controller";
import requireAuth from "../../../../presentation/middlewares/require.authentication.middleware"
import validate from "../../../../presentation/middlewares/validate.middleware"
import AddItemSchema from "../schemas/add.item.schema"
import type ITokenService from "../../../user/application/interfaces/token.service.interface";

const CartRouter = (controller: CartController, tokenService: ITokenService) => {
    const router = express.Router();
    
    router.post("/item", requireAuth(tokenService), validate(AddItemSchema), controller.addItem);
    return router;
}

export default CartRouter;