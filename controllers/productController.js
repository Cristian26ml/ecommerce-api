import ProductDao from "../dao/productDao.js";
const productDao = new ProductDao();

export const createProduct = async (req, res) => {
    try {
      const product = await productDao.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, query, sort } = req.query;

      let filter = {};
      if (query) {
        if (query === "available") {
          filter.status = true;
        } else {
          filter.category = query;
        }
      }

      let sortOption = {};
      if (sort) {
        sortOption.price = sort === "asc" ? 1 : -1;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOption,
        lean: true
      };

      const result = await productDao.getAll(filter, options);

      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
      const product = await productDao.getById(req.params.id);
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
      const product = await productDao.update(req.params.id, req.body);
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
      const product = await productDao.delete(req.params.id);
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const editProductView = async (req, res) => {
    try {
      const product = await productDao.getById(req.params.id);
      if (!product) return res.status(404).send("Producto no encontrado");
      res.render("editProduct", { product });
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