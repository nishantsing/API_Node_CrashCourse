import ProductModel from "../models/productModel.js";
import mongoose from "mongoose";
import productConfig from "../configs/productConfig.json" assert { type: "json" };

const productSchemaObject = productConfig.schema;
const productName = productConfig.productName;
const nestedAttribute = productConfig.nestedAttributes;
const singularProductName = productName.slice(0, -1);

export const createProduct = async (req, res) => {
    console.log(req.body);
    //   let productObject;
    //   for (const key in productSchemaObject) {
    //     productObject[key] = req.body[key];
    //   }
    //   const product = new ProductModel(productObject);

    //If productObject was not passed we would had done something like
    //   new ProductModel({
    //     name: req.body.name,
    //     industry: req.body.industry
    //   });

    // but we can directly pass req.body

    try {
        const product = new ProductModel(req.body); // extra or incorrect keys will be ignored.
        const productObject = {};
        await product.save();
        productObject[productName] = product;
        res.status(201).json(productObject); // product property is there
        // res.status(201).json( product )
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
    //   console.info(await mongoose.connection.db.listCollections().toArray());
    try {
        const productObject = {};
        const products = await ProductModel.find();
        productObject[productName] = products;
        res.json(productObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProduct = async (req, res) => {
    console.info({ requestParams: req.params, requestQuery: req.query });
    const { id: productId } = req.params; // destructuring and renaming
    console.info(productId);
    try {
        const productObject = {};
        const product = await ProductModel.findById(productId);
        productObject[singularProductName] = product;
        console.info(productObject);
        if (!product) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(productObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNestedAttribute = async (req, res) => {
    // @TODO: make this function more generic instead of specific to order
    try {
        const result = await ProductModel.findOne({
            "orders._id": req.params.id,
        });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productObject = {};
        const productId = req.params.id;

        // const result = await ProductModel.replaceOne(
        //     { _id: productId },
        //     req.body
        // );
        const result = await ProductModel.findOneAndReplace(
            { _id: productId },
            req.body,
            { new: true } // added flag to change the default functionality
        ); // changes the data in db but returns the original data
        productObject[singularProductName] = result;
        console.info(productObject);
        res.json(productObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProductAttribute = async (req, res) => {
    try {
        const productObject = {};
        const productId = req.params.id;

        const result = await ProductModel.findOneAndUpdate(
            { _id: productId },
            req.body,
            { new: true } // added flag to change the default functionality
        ); // changes the data in db but returns the original data
        productObject[singularProductName] = result;
        console.info(productObject);
        res.json(productObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateNestedAttribute = async (req, res) => {
    try {
        // @TODO: make this function more generic instead of specific to order
        console.log(req.params);
        const orderId = req.params.id;
        req.body._id = orderId; // mongodb changes the id of orders after every update, so to avoid the change
        // const nestedObject = {};
        // const nestedAttributeId = req.params.id;
        // const passedId = {}

        // passedId[nestedAttribute]._id = nestedAttributeId;

        const result = await ProductModel.findOneAndUpdate(
            // passedId,
            { "orders._id": orderId },
            { $set: { "orders.$": req.body } },
            { new: true }
        );

        // productObject[singularProductName] = result;
        console.info(result);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await ProductModel.deleteOne({ _id: productId });
        console.info(result);
        res.json({ deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
