import knex from 'knex';

const mySQLconfig = {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 8889, //MAMP default port
      user: "root",
      password: "root",
      database: "BEcourse"
    },
    pool: {min:0, max:7}
};

const sqliteConfig = {
    client: "sqlite3",
    connection: { filename: "./database/msgDB.sqlite"},
    useNullAsDefault: true
};

const mySQLConnection = knex(mySQLconfig);
const sqliteConnection = knex(sqliteConfig);

// To create tables
const createTables = async () => {
    try {
        await mySQLConnection.schema.dropTableIfExists("prods");
        await mySQLConnection.schema.createTable("prods", (prodsTable) => {
            prodsTable.increments("id").primary();
            prodsTable.string("title", 50).notNullable();
            prodsTable.integer("price", 10).notNullable() ;
            prodsTable.string("thumbnail", 100).notNullable();
        });

        await sqliteConnection.schema.dropTableIfExists("messages");
        await sqliteConnection.schema.createTable("messages", (prodsTable) => {
            prodsTable.increments("id").primary();
            prodsTable.string("mail", 50).notNullable();
            prodsTable.dateTime("date", 6).notNullable() ;
            prodsTable.string("message", 280).notNullable();
        });

        mySQLConnection.destroy();
        sqliteConnection.destroy();
    } catch (e) {
        console.log(e);
        mySQLConnection.destroy();
        sqliteConnection.destroy()
    };
};

await createTables();