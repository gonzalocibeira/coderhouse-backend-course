import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default class MongoClient {

    constructor(){
        this.connected = false;
        this.client = mongoose
    };

    async connect() {
        try {
            this.client.set("strictQuery", true);
            await this.client.connect(process.env.MONGO_URL);
            this.connected = true;
            console.log("Mongo DB connection successful.");
        } catch (err) {
            console.log(err);
        }
    };

    async disconnect() {
        try {
            await this.client.connection.close();
            this.connected = false;
            console.log("Mongo DB disconnected.");
          } catch (err) {
            console.log(err);
          }
    };

}