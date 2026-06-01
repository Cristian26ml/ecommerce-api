import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { io } from "../server.js";

export default class CartDao {
    async create(data = { user: null, products: [] }) {
        const cart = await Cart.create(data);
        io.emit("refreshCart", cart);
        return cart;
    }

    async getById(id) {
        return await Cart.findById(id).populate("products.product").lean();
    }

    async getByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("products.product").lean();
    }

    async addProduct(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId).populate("products.product");
        if (!cart) return null;

        const product = await Product.findById(productId);
        if (!product) throw new Error("Producto no encontrado");

        if (product.stock <= 0) {
            throw new Error("Producto sin stock disponible");
        }

        const existingItem = cart.products.find(p => p.product._id.toString() === productId);

        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                throw new Error("Cantidad solicitada supera el stock disponible");
            }
            existingItem.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        io.emit("refreshCart", cart);
        return cart;
    }

    async removeProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );

        await cart.save();
        io.emit("refreshCart", cart);
        return cart;
    }

    async updateProducts(cartId, products) {
        const cart = await Cart.findByIdAndUpdate(
            cartId,
            { products },
            { new: true }
        ).populate("products.product");

        io.emit("refreshCart", cart);
        return cart;
    }

    async updateProductQuantity(cartId, productId, change, isRelative = false) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(
            (p) => p.product.toString() === productId
        );

        if (productInCart) {
            if (isRelative) {
                productInCart.quantity += Number(change);

                if (productInCart.quantity <= 0) {
                    cart.products = cart.products.filter(
                        (p) => p.product.toString() !== productId
                    );
                }
            } else {
                productInCart.quantity = Number(change);
            }
            await cart.save();
        }

        io.emit("refreshCart", cart);
        return cart;
    }

    async clearCart(cartId) {
        const cart = await Cart.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        io.emit("refreshCart", cart);
        return cart;
    }
}