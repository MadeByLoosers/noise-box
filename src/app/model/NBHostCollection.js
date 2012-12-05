/**
 * NoiseBox
 * NBHostCollection.js
 *
 * NBHostModel Backbone Collection.
 */

var Backbone = require("backbone");
var NBHostModel = require("./NBHostModel");

var NBHostCollection = module.exports = Backbone.Collection.extend({

    model : NBHostModel
});