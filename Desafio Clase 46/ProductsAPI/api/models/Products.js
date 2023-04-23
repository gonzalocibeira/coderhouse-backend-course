/**
 * Products.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: "string", require: true},
    price: {type: "number", require: true},
    img: {type: "string", require: true},
    stock: {type: "number", require: true}
},

};

