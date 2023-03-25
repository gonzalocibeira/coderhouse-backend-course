import { model, Schema } from "mongoose";

const userSchema = Schema({
  username: { type: String },
  password: { type: String },
  name: { type: String },
  address: { type: String },
  age: { type: Number },
  phone: { type: Number },
  pic: { type: String }
});

const productSchema = new Schema({
  name: {type: String, require: true, max: 100},
  price: {type: Number, require: true},
  img: {type: String, require: true, max: 100},
  stock: {type: Number, require: true}
});

const cartSchema = new Schema({
  username: { type: String, require: true},
  products: {type: Array, require: true}
});

export const User = model("user", userSchema);
export const Product = model("product", productSchema);
export const Cart = model("cart", cartSchema);