import { Router } from "express";
import { faker } from '@faker-js/faker';

const router = Router();
const fakerData = () => {
    let products = [];
    for (let i = 0; i<5; i++){
        let tit = faker.commerce.productName();
        let pri = faker.commerce.price();
        let img = faker.image.image();
        products.push({title: tit, price: pri, thumbnail: img});
    };
    return products;
};

router
    .route("/")
    .get((req, res) => {
        res.render("inputForm")
    })

router
    .route("/api/productos-test")
    .get((req, res) => {
        let products = fakerData();
        res.render("fakeProds", {products, hasAny:true})
    })

export default router;