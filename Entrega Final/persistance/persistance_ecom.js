import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import MongoClient from "../config/mongoConfig.js";

let productDaoInstance

export default class ProductDAOMongo {

    constructor() {
        this.db = new MongoClient();
        this.prodCollection = Product;
        this.cartCollection = Cart;
    };

    static getProdDAOInstance() {
        if (!productDaoInstance) {
            productDaoInstance = new ProductDAOMongo();
        }
        return productDaoInstance;
    };

    getProducts = async () => {
        try {
            await this.db.connect();
            return await this.prodCollection.find().lean();
        } catch (err) {
            console.log(err);
        } 
    };

    getProdById = async (prodId) => {
        try {
            await this.db.connect();
            return await this.prodCollection.findOne({_id: prodId});
        } catch (err) {
            console.log(err);
        } 
    };

    getProdByCategory = async (prodCategory) => {
        try {
            await this.db.connect();
            return await this.prodCollection.find({category: prodCategory}).lean();
        } catch (err) {
            console.log(err);
        } 
    };

    getDetailedCart = async (req) => {
        try {
            await this.db.connect();
            const user = req.user.username
            const productsMongo = await this.cartCollection.findOne({username: user}, {products: 1, _id:0}).lean();
            const productsArray = productsMongo.products
        
            const productsInfo = [];
            await Promise.all(productsArray.map(async (prod) => {
                const prodData = await this.prodCollection.findOne({name: prod}, {price:1, img:1, _id:0}).lean();
        
                let prodInfo = {
                    title: prod,
                    price: prodData.price,
                    thumbnail: prodData.img
                };
        
                productsInfo.push(prodInfo);
            }));
        
            return productsInfo
        } catch (err) {
            console.log(err);
        }

    };

    clearCart = async (req) => {
        try {
            this.db.connect();

            if (req.params.id) {
                await this.cartCollection.findOneAndUpdate({_id: user}, {products: []});
            } else {
                const user = req.user.username;
                await this.cartCollection.findOneAndUpdate({username: user}, {products: []});
            }
        } catch (err) {
            console.log(err);
        }

    };

    addToCart = async (user, name) => {
        try {
            this.db.connect();
            await this.cartCollection.updateOne(
                {username: user},
                { $push: { products: name } }
            )
        } catch (err) {
            console.log(err);
        }
    };

};