import { fireProdsDb, fireCartDb } from "../Firestore/firestoreContainer";


const dbSelector = process.env.DB_SELECTOR // Boolean env variable to decide ewether to use Firestore or Mongo

const cartDbFire = new fireCartDb();
const prodsDbFire = new fireProdsDb();
const cartDbMongo = new mongoCartDb();
const prodsDbMongo = new mongoProdsDb();

export const dbConnections = dbSelector === 0 ? [cartDbFire, prodsDbFire] : [cartDbMongo, prodsDbMongo];



