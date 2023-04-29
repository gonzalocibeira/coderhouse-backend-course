// This code populates the DB with random stock of products

import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { Product } from "../models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);
await mongoose.connect(process.env.MONGO_URL);

const populate = async () => {
    for (let i = 0; i < 5; i++){
        let name = faker.commerce.productName();
        let price = faker.commerce.price();
        let img = faker.image.image();
        let stock = Math.floor(Math.random() * 50) + 1;
        let category = "products"

        const prod = {
            name,
            price,
            img,
            stock,
            category
        };

        const addProd = await Product.create(prod)
    };
};

populate();
