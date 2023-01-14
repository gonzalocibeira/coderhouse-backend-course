import { fireProdsDb, fireCartsDb } from "../Firestore/firestoreContainer";
import { mongoProdsDb, mongoCartsDb } from "../MongoDB/mongoContainer";


const dbSelector = process.env.DB_SELECTOR // Boolean env variable to decide ewether to use Firestore or Mongo

const cartDbFire = new fireCartsDb();
const prodsDbFire = new fireProdsDb();
const cartDbMongo = new mongoCartsDb();
const prodsDbMongo = new mongoProdsDb();

export const dbConnections = dbSelector === 0 ? [cartDbFire, prodsDbFire] : [cartDbMongo, prodsDbMongo];