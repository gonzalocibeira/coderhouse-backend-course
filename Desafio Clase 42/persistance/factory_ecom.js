import ProductDAOMongo from "./persistance_ecom.js";

export default class ProductFactory {
    static createDAO(type) {
        switch (type) {
            case "mongo":
                return ProductDAOMongo.getProdDAOInstance();
            default:
                return ProductDAOMongo.getProdDAOInstance();
            break;
        }
    }
}