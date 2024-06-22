import express from "express";
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductAttribute,
    updateNestedAttribute,
    getNestedAttribute,
} from "../components/productComponent.js";
import productConfig from "../configs/productConfig.json" assert { type: "json" };

const router = express.Router();
const routeName = productConfig.routeName;
const routeStructure = productConfig.routeStructure;
const routeStructureNestedAttribute =
    productConfig.routeStructureNestedAttributes.attribute1;

router.get("/", async (req, res) => {
    res.send(`Welcome to ${routeStructure}`);
});

router.get(`${routeStructure}`, getProducts);
router.get(`${routeStructure}/:id`, getProduct); // using a different path(query parameter) instead of query string as for query string it has to be handled in the same getProducts fn.
router.get(`${routeStructureNestedAttribute}/:id`, getNestedAttribute); //@TODO: nested attributes update routes and components should be handled in a separate route and component
router.post(`${routeStructure}`, createProduct);
router.put(`${routeStructure}/:id`, updateProduct);
router.patch(`${routeStructureNestedAttribute}/:id`, updateNestedAttribute); //@TODO: nested attributes update routes and components should be handled in a separate route and component
router.patch(`${routeStructure}/:id`, updateProductAttribute);
router.delete(`${routeStructure}/:id`, deleteProduct);

// Export the router
export default router;
