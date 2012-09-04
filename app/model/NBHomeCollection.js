/**
 * NoiseBox
 * NBCollection.js
 *
 * NBModel Backbone Collection.
 */

var Backbone = require("backbone");
var NBHomeClientModel = require("./NBHomeClientModel");

var NBHomeClientCollection = module.exports = Backbone.Collection.extend({

    model : NBHomeClientModel
});