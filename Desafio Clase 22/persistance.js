import { db } from "./config/firestoreConfig.js";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { normalize, schema } from "normalizr";
import util from "util";


// Class constructor
class Container {

    constructor(objType){
        this.objType = String(objType).toLocaleLowerCase()
    }

    print(objeto) {
        console.log(util.inspect(objeto, false, 12, true));
      }

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

            const objsToNormalize = {
                id:"messages",
                msgs:objs
            };
            
            const authorSchema = new schema.Entity("author");
            const messageSchema = new schema.Entity("mesage", {
                author: authorSchema
            });

            const normalizedObjs = normalize(objsToNormalize, messageSchema);

            return normalizedObjs

        }
        catch (err) {console.log(err)}
    };
};

export default Container;