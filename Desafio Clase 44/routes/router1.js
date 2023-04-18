import { Router } from "express";
import passport from "passport";
import compression from "compression";
import { controller } from "../controllers/controller.js";

const router = Router();

router.get("/", controller.getLogin);

router
    .route("/register")
    .get(controller.getRegister)
    .post(passport.authenticate("register", {failureRedirect: "/registerFail"}), controller.postRegister);

router.get("/registerFail", controller.getRegisterFail);

router
    .route("/main")
    .get(controller.isAuthenticated, controller.getMain)
    .post(passport.authenticate("login", {failureRedirect: "/loginFail"}), controller.postMain);

router.get("/loginFail", controller.getLoginFail);

router.get("/logout", controller.getLogout)

router.get("/api/productos-test", controller.isAuthenticated, controller.fakerData);

router.post("/add", controller.postAdd);

router.get("/cart", controller.isAuthenticated, controller.getCart);

router.post("/buy", controller.isAuthenticated, controller.postBuy);

router.get("/info", compression(), controller.getSysSpecs);

router.get("*", controller.unkownRoute);

export default router;