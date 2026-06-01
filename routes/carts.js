import express from "express";
import { authRole } from "../middleware/auth.js";
import {
  createCart,
  getCartById,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  removeProductFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", authRole("cliente"), createCart);
router.get("/:cid", authRole("cliente"), getCartById);
router.post("/:cid/products/:pid", authRole("cliente"), addProductToCart);
router.put("/:cid", authRole("cliente"), updateCartProducts);
router.put("/:cid/products/:pid", authRole("cliente"), updateProductQuantity);
router.delete("/:cid/products/:pid", authRole("cliente"), removeProductFromCart);
router.delete("/:cid", authRole("cliente"), clearCart);

export default router;