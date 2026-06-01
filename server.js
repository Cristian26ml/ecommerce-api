import express from "express";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/carts.js";
import viewRoutes from "./routes/views.js";
import { Server } from "socket.io";
import http from "http";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import methodOverride from "method-override";
import ordersRoutes from "./routes/order.js";
import usersRoutes from "./routes/users.js";
import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);         

const hbs = handlebars.create({
  extname: ".handlebars",
  defaultLayout: "main",
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    multiply: (a, b) => a * b,
    calculateTotal: (products) =>
      products.reduce((acc, p) => acc + (p.product.price * p.quantity), 0),
    formatDate: (date) => {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      const hours = d.getHours().toString().padStart(2, "0");
      const minutes = d.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  }
});

app.use(session({
  secret: "mi-secreto",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/ecommerce",
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

await connectDB();

const productChangeStream = Product.watch();
productChangeStream.on("change", (change) => {
  console.log("Cambio detectado en productos:", change);
  io.emit("productChange", change); // Notifica a todos los clientes
});

const orderChangeStream = Order.watch();
orderChangeStream.on("change", (change) => {
  console.log("Cambio detectado en órdenes:", change);
  io.emit("orderChange", change); // Notifica a todos los clientes
});

app.get("/", (req, res) => res.send("API E-commerce funcionando 🚀"));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/", viewRoutes);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("productUpdated", () => {
    io.emit("refreshProducts");
  });

  socket.on("cartUpdated", () => {
    io.emit("refreshCart");
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

console.log("Ruta de views:", app.get("views"));

httpServer.listen(8080, () => console.log("Servidor en puerto 8080"));

export { io };