import express from "express";
import { authRole } from "../middleware/auth.js";
import {
  dashboardCliente,
  dashboardOperario,
  dashboardAdmin,
  registerView,
  loginView,
  testView,
  productsView,
  editProductView,
  updateProductFromForm,
  deleteProductFromView,
  addProductView,
  saveNewProduct,
  cartView,
  ordersListView,
  orderDetailView,
  logoutView
} from "../controllers/viewController.js";

const router = express.Router();

router.get("/dashboard/cliente", authRole("cliente"), dashboardCliente);
router.get("/dashboard/operario", authRole("operario"), dashboardOperario);
router.get("/dashboard/admin", authRole("admin"), dashboardAdmin);

router.get("/register", registerView);
router.get("/login", loginView);
router.get("/test", testView);

router.get("/products", productsView);
router.get("/products/:id/edit", authRole("admin"), editProductView);
router.put("/products/:id", authRole("admin"), updateProductFromForm);
router.delete("/products/:id", authRole("admin"), deleteProductFromView);
router.get("/products/new", authRole("admin"), addProductView);
router.post("/products", authRole("admin"), saveNewProduct);

router.get("/carts/:cid", authRole("cliente"), cartView);

router.get("/orders", authRole(["operario", "admin"]), ordersListView);
router.get("/orders/:oid", authRole(["operario", "admin", "cliente"]), orderDetailView);
router.get("/logout", logoutView);

export default router;