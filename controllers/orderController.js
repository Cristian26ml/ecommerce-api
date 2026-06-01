import OrderDao from "../dao/orderDao.js";
import ProductDao from "../dao/productDao.js";

const productDao = new ProductDao();
const orderDao = new OrderDao();

export const createOrderFromCart = async (req, res) => {
    try {
      const { cartId } = req.params;
      const order = await orderDao.createFromCart(cartId, req.session.user?.id);
      if (!order) return res.status(404).send("Carrito no encontrado");
      res.render("orders", { order, user: req.session.user });
    } catch (error) {
      console.error("Error creando orden:", error);
      res.status(500).send("Error interno del servidor");
    }
};

export const payOrder = async (req, res) => {
  try {
    const order = await orderDao.getById(req.params.oid); // documento Mongoose
    if (!order) return res.status(404).send("Orden no encontrada");

    // Descontar stock
    for (const item of order.products) {
      await productDao.updateStock(item.product._id, -item.quantity);
    }

    order.status = "pagado";
    await order.save(); // ahora sí funciona

    res.redirect(`/orders/${req.params.oid}?msg=Compra+realizada+con+éxito`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const markOrderPaid = async (req, res) => {
    try {
      const order = await orderDao.updateStatus(req.params.oid, "pagado");
      if (!order) return res.status(404).send("Orden no encontrada");
      res.redirect(`/orders/${req.params.oid}?msg=Orden+marcada+como+pagada`);
    } catch (error) {
      res.status(500).send(error.message);
    }
};

export const shipOrder = async (req, res) => {
    try {
      const order = await orderDao.updateStatus(req.params.oid, "Enviado");
      if (!order) return res.status(404).send("Orden no encontrada");
      res.redirect(`/orders/${req.params.oid}?msg=Orden+marcada+como+enviada`);
    } catch (error) {
      res.status(500).send(error.message);
    }
};

export const listOrders = async (req, res) => {
    try {
      const orders = await orderDao.getAll();
      res.render("ordersList", { orders, user: req.session.user });
    } catch (error) {
      console.error("Error obteniendo órdenes:", error);
      res.status(500).send("Error interno del servidor");
    }
};

export const getOrderDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderDao.getById(id);
      if (!order) return res.status(404).send("Orden no encontrada");
      res.render("orderDetail", { order, msg: req.query.msg, user: req.session.user });
    } catch (error) {
      console.error("Error obteniendo orden:", error);
      res.status(500).send("Error interno del servidor");
    }
};