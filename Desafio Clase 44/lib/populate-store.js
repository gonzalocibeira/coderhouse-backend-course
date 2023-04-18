// This code populates the DB with random stock of products

import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { Product } from "../models/user.model.js";

mongoose.set("strictQuery", true);
await mongoose.connect("mongodb+srv://coderTest:Coderhouse2023@cluster0.1o7bz31.mongodb.net/?retryWrites=true&w=majority");

const populate = async () => {
    for (let i = 0; i < 5; i++){
        let name = faker.commerce.productName();
        let price = faker.commerce.price();
        let img = faker.image.image();
        let stock = Math.floor(Math.random() * 50) + 1

        const prod = {
            name,
            price,
            img,
            stock
        };

        const addProd = await Product.create(prod)
    };
};

populate();
