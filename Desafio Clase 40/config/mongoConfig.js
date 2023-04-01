import mongoose from "mongoose";

export default class MongoClient {

    constructor(){
        this.connected = false;
        this.client = mongoose
    };

    async connect() {
        try {
            this.client.set("strictQuery", true);
            await this.client.connect("mongodb+srv://coderTest:Coderhouse2023@cluster0.1o7bz31.mongodb.net/?retryWrites=true&w=majority");
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