var Backbone = require("backbone"),
    fs = require("fs");

var NBHomeModel = module.exports = Backbone.Model.extend({

    defaults : {
    },

    initialize : function () {
    },


    selectRandomBg : function () {
        var bgCount, rand, list;

        list = fs.readdirSync("./public/img/bg-home");
        bgCount = list.length;
        rand = this.getRandomInt(1,bgCount);
        return list[rand];
    },


    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});