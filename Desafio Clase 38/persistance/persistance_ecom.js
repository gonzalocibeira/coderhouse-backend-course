import { Product, Cart } from "../models/user.model.js";

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
};

const addToCart = async (user, name) => {
    await Cart.updateOne(
        {username: user},
        { $push: { products: name } }
    )
};

export { getProducts, getDetailedCart, clearCart, addToCart }