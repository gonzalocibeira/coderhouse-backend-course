import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/ecommerce"
let connection =  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export const db = mongoose.connection;

const productsSchema = new mongoose.Schema({
    name: {type: String, require: true, max: 100},
    description: {type: String, require: true, max: 200},
    code: {type: String, require: true, max: 18},
    picURL: {type: String, require: true, max: 100},
    price: {type: Number, require: true},
    stock: {type: Number, require: true}
});

const cartsSchema = new mongoose.Schema({
    products: {type: Array, require: true}
});

export const products = mongoose.model("products", productsSchema);
export const carts = mongoose.model("carts", cartsSchema);