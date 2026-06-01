import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export default class OrderDao {
    async createFromCart(cartId, userId = null) {
        const cart = await Cart.findById(cartId).populate("products.product");
        if (!cart) return null;

        const total = cart.products.reduce(
            (acc, p) => acc + (p.product.price * p.quantity),
            0
        );

        const order = await Order.create({
            user: userId,
            products: cart.products.map(p => ({
            product: p.product._id,
            quantity: p.quantity
            })),
            total,
            status: "pendiente"
        });

        cart.products = [];
        await cart.save();

        return await Order.findById(order._id).populate("products.product").lean();
    }

    async getAll() {
        return await Order.find()
            .populate("products.product")
            .lean();
    }
    async getById(orderId) {
        return await Order.findById(orderId)
            .populate("products.product");
    }

    async getByIdLean(orderId) {
        return await Order.findById(orderId)
            .populate("products.product")
            .lean();
    }

    async updateStatus(orderId, status) {
        return await Order.findByIdAndUpdate(
            orderId,
            { status },
            { returnDocument: "after" }
        );
    }

}