import { Router } from "express";
import passport from "passport";
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

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log(req.isAuthenticated)
        next();
    }
    else {
        res.redirect("/");
    }
};


router
    .route("/")
    .get((req, res) => {
        res.render("login")
    });

router
    .route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post(
        passport.authenticate("register", {failureRedirect: "/registerFail"}),
        (req, res) => res.redirect("/")
    );

router.get("/registerFail", (req, res) => res.render("registerError"));

router
    .route("/main")
    .post(
        passport.authenticate("login", {failureRedirect: "/loginFail"}),
        (req, res) => {
            res.render("inputForm", {username: req.body.username})
        }
    );

router.get("/loginFail", (req, res) => res.render("loginError"));

router.get("/logout", (req, res) => {
    req.logout(() => {
        return res.render("logout")
    });
})

router
    .route("/api/productos-test")
    .get(isAuthenticated, (req, res) => {
        let products = fakerData();
        res.render("fakeProds", {products, hasAny:true})
    });

export default router;