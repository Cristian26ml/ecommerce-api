import Product from "../models/Product.js";
import { io } from "../server.js";

export default class ProductDao {

    constructor() {
        this.model = Product;
    }

    async getAll(filter = {}, options = {}) {
        return await this.model.paginate(filter, { ...options, lean: true });
    }

    async getById(id) {
        return await Product.findById(id).lean();
    }

    async getByCode(code) {
        return await Product.findOne({ code }).lean();
    }

    async create(productData) {
        const product = await Product.create(productData);
        const products = await Product.find().lean();
        io.emit("refreshProducts", products);
        return product;
    }

    async delete(productId) {
        const deleted = await Product.findByIdAndDelete(productId);
        const products = await Product.find().lean();
        io.emit("refreshProducts", products);
        return deleted;
    }

    async update(productId, updateData) {
        const updated = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        const products = await Product.find().lean();
        io.emit("refreshProducts", products);
        return updated;
    }

    async updateStock(productId, change) {
        return await this.model.findByIdAndUpdate(
            productId,
            { $inc: { stock: change } },
            { new: true }
        );
    }


}
