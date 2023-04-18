import { buildSchema } from "graphql";

const prodSchema = buildSchema(`
    type Product {
        name: String!,
        price: Int,
        img: String,
        stock: Int
    }
    type Cart {
        username: String!,
        products: [Product]
    }
    type Query {
        getCart(username: String!): Cart
    }
    type Mutation {
        clearCart(username: String!): Cart,
    }
`);

export default prodSchema;