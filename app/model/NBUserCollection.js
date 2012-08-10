var Backbone = require("backbone");
var NBUserModel = require("./NBUserModel");

var NBUserCollection = module.exports = Backbone.Collection.extend({

    model : NBUserModel
});