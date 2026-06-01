import CartDao from "../dao/cartDao.js";
const cartDao = new CartDao();

export const createCart = async (req, res) => {
    try {
        const cart = await cartDao.create();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartDao.getById(req.params.cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.render("carts", { cart });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const cartId = req.session.user.cartId;
        const cart = await cartDao.addProduct(cartId, req.params.pid, Number(quantity));
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.redirect(`/carts/${cartId}?msg=Producto+agregado+al+carrito`);
    } catch (error) {
        res.redirect(`/carts/${req.session.user.cartId}?error=${encodeURIComponent(error.message)}`);
    }
};

export const updateCartProducts = async (req, res) => {
    try {
        const cart = await cartDao.updateProducts(req.params.cid, req.body.products);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.redirect(`/carts/${req.params.cid}?msg=Carrito+actualizado`);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updateProductQuantity = async (req, res) => {
    try {
        if (!req.body.change) return res.status(400).send("No se recibió el campo 'change'");
        const change = Number(req.body.change);
        const cart = await cartDao.updateProductQuantity(req.params.cid, req.params.pid, change, true);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        const msg = change > 0 ? "Cantidad+aumentada" : "Cantidad+reducida";
        res.redirect(`/carts/${req.params.cid}?msg=${msg}`);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const cart = await cartDao.removeProduct(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.redirect(`/carts/${req.params.cid}?msg=Producto+eliminado+del+carrito`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartDao.clearCart(req.params.cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.redirect(`/carts/${req.params.cid}?msg=Carrito+vaciado`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};