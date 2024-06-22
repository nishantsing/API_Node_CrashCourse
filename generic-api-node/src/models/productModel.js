import mongoose from "mongoose";
import productConfig from "../configs/productConfig.json" assert { type: "json" };

console.info(typeof productConfig); //objec, so no conversion require
console.info(productConfig);
// const p_config = JSON.parse(productConfig);
// console.log(p_config);

const productSchemaObject = productConfig.schema;
const productCollectionName = productConfig.collectionName;

console.log(productSchemaObject);
//schema // No need of {} inside Schema if passed schema is already a js object
// const productSchema = new mongoose.Schema({
//   name:{
//     type:String,
//     required:true
//   },
//   industry: String
// });
const productSchema = new mongoose.Schema(productSchemaObject);

//pass collection name, it will be pluralized and lowecased in monogdb in mongodb and schema to create a model
export default mongoose.model(productCollectionName, productSchema);
