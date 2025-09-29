import Products from "./productsModel.js";

async function renderAllProducts(req, res) {
    const products = await Products.findAll();
    res.json(products);
}

async function renderOneProduct(req, res, next, productId) {
    const product = await Products.findOne({
        where: {
            id: productId,
        },
    });
    if (product == null) {
        let error = { message: "Product not found.", status: 404 };
        return next(error);
    }
    res.json(product);
}

export { renderAllProducts, renderOneProduct };
