import { sendMail, sendSMS } from "../services/services.js";
import { getProducts, getDetailedCart, clearCart, addToCart } from "../persistance/persistance_ecom.js"
import { faker } from '@faker-js/faker';
import os from "os";
import logger from "../lib/log4js.js";


const getLogin = (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`)
    res.render("login")
};

const getRegister = (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`),
    res.render("register")
};

const postRegister = (req, res) => {
    sendMail(req);
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    res.redirect("/")
};

const getRegisterFail = (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    res.render("registerError")
};

const isAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    }
    else {
        res.redirect("/");
    }
};

const getMain = async (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    const prods = await getProducts();
    res.render("inputForm", {username: req.user.username, address: req.user.address, pic: req.user.pic, name: req.user.name, age: req.user.age, phone: req.user.phone, products: prods})
};

const postMain = async (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);
    const prods = await getProducts();
    res.render("inputForm", {username: req.body.username, address: req.user.address, pic: req.user.pic, name: req.user.name, age: req.user.age, phone: req.user.phone, products: prods})
};

const getLoginFail = (req, res) => {
    res.render("loginError")
};

const getLogout = (req, res) => {
    req.logout(() => {
        logger.info(`${req.method} request from ${req.originalUrl} route`);
        return res.render("logout")
    });
};

const fakerData = (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);

    try{
        let products = [];
        const rndInt = Math.floor(Math.random() * 7) + 1
        for (let i = 0; i < rndInt; i++){
            let tit = faker.commerce.productName();
            let pri = faker.commerce.price();
            let img = faker.image.image();
            products.push({title: tit, price: pri, thumbnail: img});
        };

        res.render("fakeProds", {products, hasAny:true})

    } catch (err){
        logger.error(`${err}`);
    }
};

const postAdd = async (req, res) => {
    const name = req.body.prodName
    const user = req.user.username
    logger.info(`${name} added to cart by user ${user}!`);
    try {
        addToCart(user, name);
        return res.status(201)
    }
    catch (err) {
        logger.error(`${err}`);
    }
};

const getCart = async (req, res) => {
    try{
        const userCart = await getDetailedCart(req);
        console.log(userCart);
        res.render("cart", {userCart, hasAny:true})
    } catch (err){
        logger.error(`${err}`);
    }
};

const postBuy = async (req, res) => {
    const userCart = await getDetailedCart(req);
    const userCartText = JSON.stringify(userCart);
    sendMail(req, "purchase", "New purchase", userCartText);
    sendSMS(req, "Order recieved and in process");
    clearCart(req);
    res.redirect("/main");
};

const getSysSpecs = (req, res) => {
    logger.info(`${req.method} request from ${req.originalUrl} route`);

    let args = process.argv;
    let so = process.platform;
    let nodeVer = process.version;
    let rss = process.memoryUsage.rss();
    let execPath = process.execPath;
    let pId = process.pid;
    let folder = process.cwd();
    let cores = os.cpus().length;

    console.log(args+so+nodeVer+rss+execPath+pId+folder+cores);

    res.render("info", {args, so, nodeVer, rss, execPath, pId, folder, cores})
};

const unkownRoute = (req, res) => {
    logger.warn(`${req.method} request from ${req.originalUrl} route`);
    res.status(404).send("Sorry this route does not exist")
};

export { getLogin, getRegister, postRegister, getRegisterFail, isAuthenticated, getMain, postMain, getLoginFail, getLogout, fakerData, postAdd, getCart, postBuy, getSysSpecs, unkownRoute };