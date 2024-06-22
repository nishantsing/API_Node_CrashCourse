import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoute from "./routes/productRoute.js";
import cors from "cors";



const app = express();

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}


const PORT = process.env.PORT || 5000;
const CONNECTION = process.env.CONNECTION;

mongoose.set("strictQuery", false);
app.use(cors()); // allows cross-origin to backend, not secure though, look more how to configure this
app.use(express.json()); //Used to parse JSON bodies
// Use the router
app.use("/", productRoute);

const start = async () => {
    try {
        // connect to db
        await mongoose.connect(CONNECTION);

        // start the server
        app.listen(PORT, () => {
            console.log(`Running on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error.message);
    }
};

start();
