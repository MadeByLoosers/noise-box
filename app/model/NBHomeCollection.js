/**
 * NoiseBox
 * NBHomeCollection.js
 *
 * NBHomeModel Backbone Collection.
 */

var Backbone = require("backbone");
var NBHomeModel = require("./NBHomeModel");

var NBHomeCollection = module.exports = Backbone.Collection.extend({

    model : NBHomeModel
});