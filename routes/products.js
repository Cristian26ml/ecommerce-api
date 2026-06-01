import express from "express";
import { authRole } from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  editProductView,
  updateProductFromForm
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", authRole("admin"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/:id/edit", authRole("admin"), editProductView);
router.put("/:id", authRole("admin"), updateProductFromForm);
router.delete("/:id", authRole("admin"), deleteProduct);

export default router;