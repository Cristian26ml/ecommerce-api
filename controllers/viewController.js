import ProductDao from "../dao/productDao.js";
import CartDao from "../dao/cartDao.js";
import OrderDao from "../dao/orderDao.js";

const productDao = new ProductDao();
const cartDao = new CartDao();
const orderDao = new OrderDao();

export const dashboardCliente = (req, res) => {
    res.render("dashboard_cliente", {
        title: "Dashboard Cliente",
        pageCSS: "dashboard.css",
        username: req.session.user.username,
        cartId: req.session.user.cartId
    });
};

export const dashboardOperario = (req, res) => {
    res.render("dashboard_operario", {
        title: "Dashboard Operario",
        pageCSS: "dashboard.css",
        username: req.session.user.username
    });
};

export const dashboardAdmin = (req, res) => {
    res.render("dashboard_admin", {
        title: "Dashboard Admin",
        pageCSS: "dashboard.css",
        username: req.session.user.username
    });
};

export const registerView = (req, res) => {
    res.render("register", { title: "Registro", pageCSS: "register.css" });
};

export const loginView = (req, res) => {
    res.render("login", { title: "Login", pageCSS: "login.css" });
};

export const testView = (req, res) => {
    res.render("test");
};

export const logoutView = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("Error al cerrar sesión");
        }
        res.redirect("/login");
    });
};


export const productsView = async (req, res) => {
    try {
        const result = await productDao.getAll({}, { lean: true });
        res.render("products", {
            title: "Productos",
            pageCSS: "products.css",
            products: result.docs,
            cartId: req.session?.user?.cartId || null,
            userRole: req.session?.user?.role || null
        });
    } catch (error) {
        console.error("Error en /products:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const editProductView = async (req, res) => {
    try {
        const product = await productDao.getById(req.params.id);
        if (!product) return res.status(404).send("Producto no encontrado");
        res.render("editProduct", {
            title: "Editar Producto",
            pageCSS: "editProduct.css",
            product,
            user: req.session.user
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const updateProductFromForm = async (req, res) => {
    try {
        await productDao.update(req.params.id, req.body);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const deleteProductFromView = async (req, res) => {
    try {
        await productDao.delete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const addProductView = (req, res) => {
    res.render("addProduct", { 
        title: "Agregar Producto",
        pageCSS: "products.css",
        user: req.session.user 
    });
};

export const saveNewProduct = async (req, res) => {
    try {
        const existingProduct = await productDao.getByCode(req.body.code);
        if (existingProduct) {
            return res.render("addProduct", {
                title: "Agregar Producto",
                pageCSS: "products.css",
                user: req.session.user,
                error: "Ya existe un producto con ese código",
                product: req.body
            });
        }
        await productDao.create(req.body);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const cartView = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getById(cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.render("carts", {
            title: "Carrito",
            pageCSS: "carts.css",
            cart,
            msg: req.query.msg || null
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const ordersListView = async (req, res) => {
    try {
        const orders = await orderDao.getAll();
        res.render("ordersList", {
            title: "Listado de Órdenes",
            pageCSS: "orders.css",
            orders,
            user: req.session.user
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const orderDetailView = async (req, res) => {
    try {
        const order = await orderDao.getByIdLean(req.params.oid);
        if (!order) return res.status(404).send("Orden no encontrada");
        res.render("orderDetail", {
            title: "Detalle de Órden",
            pageCSS: "orders.css",
            order,
            msg: req.query.msg,
            error: req.query.error,
            user: req.session.user
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};