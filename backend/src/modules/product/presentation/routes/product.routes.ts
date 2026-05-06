import express from "express";
import requireAuth from "../../../../presentation/middlewares/require.authentication.middleware";
import requireAdmin from "../../../../presentation/middlewares/require.admin.middleware";
import type ProductController from "../controllers/product.controller";
import type ITokenService from "../../../user/application/interfaces/token.service.interface";
const productRouter = (controller: ProductController, tokenService: ITokenService) => {
    const router = express.Router();
    
    router.get("/all", controller.index);
    router.get("/:id", controller.show);
    router.post("/", requireAuth(tokenService), requireAdmin, controller.store);
    router.put("/:id", requireAuth(tokenService), requireAdmin, controller.update);
    router.delete("/:id", requireAuth(tokenService), requireAdmin, controller.destroy);

    return router;
}

export default productRouter;