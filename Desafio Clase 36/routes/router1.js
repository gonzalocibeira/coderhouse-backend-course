import { Router } from "express";
import passport from "passport";
import { faker } from '@faker-js/faker';
import os from "os";
import compression from "compression";
import logger from "../lib/log4js.js";
import { createTransport } from "nodemailer";
import { Product, Cart } from "../models/user.model.js"

const router = Router();

const fakerData = () => {
    let products = [];
    const rndInt = Math.floor(Math.random() * 7) + 1
    for (let i = 0; i < rndInt; i++){
        let tit = faker.commerce.productName();
        let pri = faker.commerce.price();
        let img = faker.image.image();
        products.push({title: tit, price: pri, thumbnail: img});
    };
    return products;
};

const isAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    }
    else {
        res.redirect("/");
    }
};

const sendMail = async (req) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'santina13@ethereal.email',
            pass: 'WwB5MV9UucJdZeKmj2'
        }
    });
  
    const adminMail = "turcoturco95@gmail.com";

    const mailOtions = {
    from: "Node Server",
    to: adminMail,
    subject: "New user",
    html: `<p>New user with mail:${req.body.email}, name:${req.body.name}, address:${req.body.address}, age:${req.body.age} and phone:${req.body.phone}</p>`,
    };

    try {
    transporter.sendMail(mailOtions);
    }
    catch (err) {
    logger.info("Failed to send mail");
    }
};

const getProducts = () => {
    return Product.find().lean();
};

router
    .route("/")
    .get((req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`)
        res.render("login")
    });

router
    .route("/register")
    .get((req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`),
        res.render("register")
    })
    .post(
        passport.authenticate("register", {failureRedirect: "/registerFail"}),
        (req, res) => {
            sendMail(req);
            logger.info(`${req.method} request from ${req.originalUrl} route`);
            res.redirect("/")
        }
    );

router.get("/registerFail", (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    res.render("registerError")
});

router
    .route("/main")
    .get(
        isAuthenticated, async (req, res) => {
            logger.info(`${req.method} request from ${req.originalUrl} route`);
            const prods = await getProducts();
            res.render("inputForm", {username: req.user.username, address: req.user.address, pic: req.user.pic, name: req.user.name, age: req.user.age, phone: req.user.phone, products: prods})
        }
    )
    .post(
        passport.authenticate("login", {failureRedirect: "/loginFail"}),
        async (req, res) => {
            logger.info(`${req.method} request from ${req.originalUrl} route`);
            const prods = await getProducts();
            res.render("inputForm", {username: req.body.username, address: req.user.address, pic: req.user.pic, name: req.user.name, age: req.user.age, phone: req.user.phone, products: prods})
        }
    );

router.get("/loginFail", (req, res) => res.render("loginError"));

router.get("/logout", (req, res) => {
    req.logout(() => {
        logger.info(`${req.method} request from ${req.originalUrl} route`);
        return res.render("logout")
    });
})

router
    .route("/api/productos-test")
    .get(isAuthenticated, (req, res) => {
        logger.info(`${req.method} request from ${req.originalUrl} route`);
        try{
            let products = fakerData();
            res.render("fakeProds", {products, hasAny:true})
        } catch (err){
            logger.error(`${err}`);
        }
    });

router.get("/info", compression(), (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`)
    let args = process.argv;
    let so = process.platform;
    let nodeVer = process.version;
    let rss = process.memoryUsage.rss();
    let execPath = process.execPath;
    let pId = process.pid;
    let folder = process.cwd();
    let cores = os.cpus().length;
    console.log(args+so+nodeVer+rss+execPath+pId+folder+cores)
    res.render("info", {args, so, nodeVer, rss, execPath, pId, folder, cores})
});

router
    .route("/add")
    .post(async (req, res) => {
        const name = req.body.prodName
        const user = req.user.username
        logger.info(`${name} added to cart by user ${user}!`);
        try {
            await Cart.updateOne(
                {username: user},
                { $push: { products: name } }
            )
            return res.status(201)
        }
        catch (err) {
            logger.error(`${err}`);
        }
        
    });

router 
    .route("/cart")
    .get(isAuthenticated, async (req, res) => {
        try{
            const user = req.user.username
            const products = await Cart.find({username: user}, {products: 1, _id:0});
            console.log(products.products);
            const productsInfo = [];
/*             products.forEach((prod) => {
                let price = Product.find({name: prod}).price;
                let image = Product.find({name: prod}).img;

                let prodInfo = {
                    prod,
                    price,
                    image
                };

                productsInfo.push(prodInfo);
            }); */
            res.render("cart", {productsInfo, hasAny:true})
        } catch (err){
            logger.error(`${err}`);
        }
    })

router.get("*", (req, res) => {
    logger.warn(`${req.method} request from ${req.originalUrl} route`);
    res.status(404).send("Sorry this route does not exist")
})

export default router;