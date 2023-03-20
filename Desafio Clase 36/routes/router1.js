import { Router } from "express";
import passport from "passport";
import { faker } from '@faker-js/faker';
import os from "os";
import compression from "compression";
import logger from "../lib/log4js.js";
import { createTransport } from "nodemailer";
import { Product, Cart } from "../models/user.model.js";
import twilio from "twilio";

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

const sendMail = async (req, type = "newUser", subject = "New user registered", items) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kariane30@ethereal.email',
            pass: 'eJ9Nk6gDxqZN2G1c2B'
        }
    });
  
    const adminMail = "turcoturco95@gmail.com";

    let mailBody = "";
    switch (type) {
        case "newUser":
            mailBody = `<p>New user with mail:${req.body.email}, name:${req.body.name}, address:${req.body.address}, age:${req.body.age} and phone:${req.body.phone}</p>`;
            break;
        case "purchase":
            mailBody = `<p>New purchase from user ${req.user.username}, details:${items}</p>`;
            break;
    };

    const mailOtions = {
    from: "Node Server",
    to: adminMail,
    subject,
    html: mailBody
    };

    try {
    transporter.sendMail(mailOtions);
    }
    catch (err) {
    logger.info("Failed to send mail");
    }
};

const sendSMS = async (req, message) => {
    const accountSid = process.env.TWILIOSSID;
    const authToken = process.env.TWILIOAUTH;
    
    const client = twilio(accountSid, authToken);

    const options = {
        body: message,
        from: "+15178365226",
        to: req.user.phone,
      };
      
      try {
        const message = await client.messages.create(options);
      } catch (err) {
        logger.warn(err);
      }
};

const getProducts = () => {
    return Product.find().lean();
};

const getDetailedCart = async (req) => {
    const user = req.user.username
    const productsMongo = await Cart.findOne({username: user}, {products: 1, _id:0}).lean();
    const productsArray = productsMongo.products

    const productsInfo = [];
    await Promise.all(productsArray.map(async (prod) => {
        const prodData = await Product.findOne({name: prod}, {price:1, img:1, _id:0}).lean();

        let prodInfo = {
            title: prod,
            price: prodData.price,
            thumbnail: prodData.img
        };

        productsInfo.push(prodInfo);
    }));

    return productsInfo
};

const clearCart = async (req) => {
    const user = req.user.username;
    await Cart.findOneAndUpdate({username: user}, {products: []});
}

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
            const userCart = await getDetailedCart(req);
            console.log(userCart);
            res.render("cart", {userCart, hasAny:true})
        } catch (err){
            logger.error(`${err}`);
        }
    });

router
    .route("/buy")
    .post(isAuthenticated, async (req,res) => {
        const userCart = await getDetailedCart(req);
        const userCartText = JSON.stringify(userCart);
        sendMail(req, "purchase", "New purchase", userCartText);
        sendSMS(req, "Order recieved and in process");
        clearCart(req);
        res.redirect("/main");
    })

router.get("*", (req, res) => {
    logger.warn(`${req.method} request from ${req.originalUrl} route`);
    res.status(404).send("Sorry this route does not exist")
})

export default router;