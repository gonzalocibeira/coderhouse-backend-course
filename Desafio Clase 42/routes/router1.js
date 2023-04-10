import { Router } from "express";
import passport from "passport";
import compression from "compression";
import { getLogin, getRegister, postRegister, getRegisterFail, isAuthenticated, getMain, postMain, getLoginFail, getLogout, fakerData, postAdd, getCart, postBuy, getSysSpecs, unkownRoute } from "../controllers/controller.js";

const router = Router();

router.get("/", getLogin);

router
    .route("/register")
    .get(getRegister)
    .post(passport.authenticate("register", {failureRedirect: "/registerFail"}), postRegister);

router.get("/registerFail", getRegisterFail);

router
    .route("/main")
    .get(isAuthenticated, getMain)
    .post(passport.authenticate("login", {failureRedirect: "/loginFail"}), postMain);

router.get("/loginFail", getLoginFail);

router.get("/logout", getLogout)

router.get("/api/productos-test", isAuthenticated, fakerData);

router.post("/add", postAdd);

router.get("/cart", isAuthenticated, getCart);

router.post("/buy", isAuthenticated, postBuy);

router.get("/info", compression(), getSysSpecs);

router.get("*", unkownRoute);

export default router;