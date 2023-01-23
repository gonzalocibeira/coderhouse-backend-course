import knex from 'knex';

// Class constructor
class Container {
    constructor(config, table){
        this.config = config;
        this.table = table;
    };

    async save(object) {
        try {
            const dbConnect = knex(this.config);
            await dbConnect(this.table).insert(object);
            dbConnect.destroy();
        } catch (e) {
            console.log(e);
            dbConnect.destroy()
        }
    };

    async getAll() {
        try {
            const dbConnect = knex(this.config);
            const products = await dbConnect.from(this.table).select("*");
            dbConnect.destroy();
            return products;
        } catch (e) {
            console.log(e);
            dbConnect.destroy();
        }
    }
};

export default Container;