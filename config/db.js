import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ecommerce");
        console.log("Conectado a MongoDB local");
    } catch (error) {
        console.error("Error de conexión:", error);
        process.exit(1);
    }
};