import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { passportStrategies } from "./lib/pasport.lib.js";
import { Server as IOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import router1 from "./routes/router1.js";
import { User } from "./models/user.model.js"
import { engine } from "express-handlebars";
import { faker } from '@faker-js/faker';
import Container from "./persistance.js";


const chatMsgs = new Container("messages");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

app.use(
    session({
      secret: "coderhouse",
      rolling: true,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl:
          "mongodb+srv://coderTest:Coderhouse2023@cluster0.1o7bz31.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions,
      }),
      cookie:{
        maxAge: 600000
      }
    })
  );

app.use(passport.initialize());
app.use(passport.session());

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id);
});

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

mongoose.set("strictQuery", true);
await mongoose.connect("mongodb://localhost:27017/ecommece");
const expressServer = app.listen(3000, () => {
        console.log("listening on port 3000")
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

