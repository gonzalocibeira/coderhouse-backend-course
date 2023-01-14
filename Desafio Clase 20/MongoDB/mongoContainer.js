import mongoose from "mongoose";
import { db, products, carts } from "./mongoConfig.js";



class mongoContainer {

    constructor(){
        this.usedModel = products
    }

    //CRUD methods for Products and Carts

    async save (object){
        try {
            const model = new this.usedModel(object)
            let save = model.save();
        }
        catch (err) {console.log(err)}
    };

    async getAll () {
        try {
            let data = await this.usedModel.find({})
            return data
        }
        catch (err) {console.log(err)}
    };

    async getById (id) {
        try {
            let data = await this.usedModel.find({_id: id});
            return data
        }
        catch (err) {console.log(err)}
    };

    async deleteAll () {
        try {
            let del = await this.usedModel.deleteMany({});
            return "All items deleted successfully"
        }
        catch (err) {console.log(err)}
    };

    async deleteById (id) {
        try {
            let del = await this.usedModel.deleteOne({_id: id});
            return "Item deleted successfully"
        }
        catch (err) {console.log(err)}
    };

    async updateById (id, obj) {
        try {
            let upd = await this.usedModel.findOneAndUpdate({_id: id}, obj);
            return "Item updated successfully"
        }
        catch (err) {console.log(err)}
    }
};

export class mongoProdsDb extends mongoContainer {

    constructor(usedModel){
        super(usedModel);
        this.usedModel = products
    }
};

export class mongoCartsDb extends mongoContainer {

    constructor(usedModel){
        super(usedModel);
        this.usedModel = carts
    };

    async addProdToCart (cartId, product){
        try {
            let add = await this.usedModel.updateOne({_id: cartId}, {$push: { products: product }});
            return `Product added successfully to cart ${cartId}`
        }
        catch (err) {console.log(err)}
    };

    async delProdInCart (cartId, prodName){
        let del = await this.usedModel.updateOne({_id: cartId}, {$pull: {products: {name: prodName}}} )
    }
}
