/**
 * NoiseBox
 * NBCollection.js
 *
 * NBModel Backbone Collection.
 */

var Backbone = require("backbone");
var NBModel = require("./NBModel");

var NBCollection = module.exports = Backbone.Collection.extend({

    model : NBModel
});