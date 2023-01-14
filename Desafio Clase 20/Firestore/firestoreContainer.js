import { db } from "./firestoreConfig.js";
import { collection, addDoc, query, doc, updateDoc, getDoc, getDocs, deleteDoc  } from "firebase/firestore";


class fireContainer {

    constructor(objType){
        this.objType = String(objType).toLocaleLowerCase()
    }

    //CRUD methods for Products and Carts
    async save (object){
        try {
            const coll = collection(db, this.objType);
            await addDoc(coll, object != null ? object : {})
        }
        catch (err) {console.log(err)}
    };

    async getAll (){
        const objs = [];

        try {
            const q = query(collection(db, this.objType));
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {objs.push(doc.data())});
            return objs;
        }
        catch (err) {console.log(err)}
    };

    async getById (id){
        try{
            const q = doc(db, this.objType, id);
            const snapshot = await getDoc(q)
            return snapshot.data();
        }
        catch (err) {console.log(err)}
    };

    async deleteAll(){
        try {
            const q = query(collection(db, this.objType));
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {deleteDoc(doc.ref)});
            return "All items deleted successfully"

        }
        catch (err) {console.log(err)}
    };

    async deleteById (id){
        try{
            const q = doc(db, this.objType, id);
            await deleteDoc(q);
            return "Item deleted successfully"
        }
        catch (err) {console.log(err)}
    };

    async updateById(id, obj){
        try{
            const q = doc(db, this.objType, id);
            await updateDoc(q, obj);
            return "Item updated successfully"
        }
        catch (err) {console.log(err)}
    };
};

export class fireProdsDb extends fireContainer {

    constructor(objType){
        super(objType);
        this.objType = "products"
    }
};

export class fireCartsDb extends fireContainer {

    constructor(objType){
        super(objType);
        this.objType = "cart"
    };

    async addProdToCart (cartId, product){
        try{
            const q = collection(db, this.objType, cartId, "prodsInCart");
            await addDoc(q, product);
            return `Product added successfully to cart ${cartId}`
        }
        catch (err) {console.log(err)}
    };

    async delProdInCart (cartId, prodId){
        try{
            const q = doc(db, this.objType, cartId, "prodsInCart", prodId);
            await deleteDoc(q);
            return `Product ID ${prodId} deleted successfully from cart ${cartId}`
        }
        catch (err) {console.log(err)}
    }

};