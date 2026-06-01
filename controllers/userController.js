import User from "../models/User.js";
import bcrypt from "bcrypt";
import CartDao from "../dao/cartDao.js";

const cartDao = new CartDao();

export const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed, role });
        await user.save();
        res.send("Usuario registrado");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send("Usuario no encontrado");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send("Credenciales inválidas");

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        };

        if (user.role === "cliente") {
            let cart = await cartDao.getByUserId(user._id);
            if (!cart) {
                cart = await cartDao.create({ user: user._id, products: [] });
            }
            req.session.user.cartId = cart._id.toString();
            return res.redirect("/dashboard/cliente");
        }

        if (user.role === "operario") {
            return res.redirect("/dashboard/operario");
        }

        if (user.role === "admin") {
            return res.redirect("/dashboard/admin");
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("Error al cerrar sesión");
        }
        res.redirect("/login");
    });
};