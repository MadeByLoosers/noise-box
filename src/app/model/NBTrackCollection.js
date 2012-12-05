/**
 * NoiseBox
 * NBTrackCollection.js
 *
 * NBTrackModel Backbone Collection.
 */

var Backbone = require("backbone");
var NBTrackModel = require("./NBTrackModel");

var NBTrackCollection = module.exports = Backbone.Collection.extend({

    model : NBTrackModel
});