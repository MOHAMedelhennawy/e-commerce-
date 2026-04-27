import express from "express";
import type ProductController from "../controllers/product.controller";

const productRouter = (controller: ProductController) => {
    const router = express.Router();
    
    router.get("/all", controller.index);
    router.get("/:id", controller.show);
    router.post("/", controller.store);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.destroy);

    return router;
}

export default productRouter;