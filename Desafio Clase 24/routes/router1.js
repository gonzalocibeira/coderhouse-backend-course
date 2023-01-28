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
        res.render("login")
    })

router
    .route("/login")
    .post((req, res) => {
        let user = req.body.user;
        if (user) req.session.user = user;
        res.render("inputForm", {user})
    })

router
    .route("/logout")
    .get((req, res) => {
        let user = req.session.user;
        req.session.destroy();
        res.render("logout", {user})
    })

router
    .route("/api/productos-test")
    .get((req, res, next) => {
        req.session.user ? next() : res.redirect("/")
    }, (req, res) => {
        let products = fakerData();
        res.render("fakeProds", {products, hasAny:true})
    })

export default router;