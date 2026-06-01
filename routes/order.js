import { Router } from "express";
import { authRole } from "../middleware/auth.js";
import {
  createOrderFromCart,
  payOrder,
  markOrderPaid,
  shipOrder,
  listOrders,
  getOrderDetail
} from "../controllers/orderController.js";

const router = Router();

router.post("/:cartId", authRole("cliente"), createOrderFromCart);
router.post("/:oid/pay", authRole("cliente"), payOrder);
router.post("/:oid/mark-paid", authRole("operario"), markOrderPaid);
router.post("/:oid/ship", authRole("admin"), shipOrder);
router.get("/", authRole(["operario", "admin"]), listOrders);
router.get("/:id", authRole(["operario", "admin", "cliente"]), getOrderDetail);

export default router;