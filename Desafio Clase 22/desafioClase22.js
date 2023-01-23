import express, { json, urlencoded } from "express";
import { Server as IOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import router1 from "./routes/router1.js";
import { engine } from "express-handlebars";
import { faker } from '@faker-js/faker';
import Container from "./persistance.js";

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

const prods = new Container(mySQLconfig, "prods");
const chatMsgs = new Container(sqliteConfig, "messages");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));

app.engine(
    "hbs", 
    engine({
        extname: ".hbs",
        defaultLayout: join(__dirname, "public/views/layouts/main.hbs"),
        layoputsDir: join(__dirname, "public/views/layouts/"),
        partialsDir: join(__dirname, "public/views/partials")
    })
);

app.set("view engine", "hbs");
app.set("views", join(__dirname, "/public/views"))

app.use(json());
app.use(urlencoded({extended: true}));

app.use("/", router1);

const expressServer = app.listen(8000, () => {
        console.log("listening on port 8000")
});

const io = new IOServer(expressServer);

const fakerData = () => {
    let products = [];
    for (let i = 0; i<5; i++){
        let tit = faker.commerce.productName();
        let pri = faker.commerce.price();
        let img = faker.image.image();
        products.push({title: tit, price: pri, thumbnail: img});
    };
    return products;
};

io.on("connection", (socket) => {
    console.log(`New connection, socket ID: ${socket.id}`);

    chatMsgs.getAll()
        .then ((data) => socket.emit("server:message", data))

    socket.emit("server:product", fakerData())

    socket.on("client:message", (messageInfo) => {
        chatMsgs.save(messageInfo)
            .then(()=> chatMsgs.getAll()
                    .then ((data) => io.emit("server:message", data))
            )
    });

    socket.on("client:product", () => {
        let products = fakerData()
        io.emit("server:product", products)

    })


});

app.on("error", (err) => {console.log(err)});