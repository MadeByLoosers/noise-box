var Backbone = require("backbone");
var NBCollection = require("./NBCollection");

var AppModel = module.exports = Backbone.Model.extend({

    defaults : {

    },

    initialize : function () {

        this.noiseBoxes = new NBCollection();
    },

    addNoiseBox : function (name) {

        this.noiseBoxes.add({name:name});

        return this.getNoiseBox(name);
    },

    noiseBoxExists : function (name) {

        return this.getNoiseBox(name) !== undefined;
    },

    getNoiseBox : function (name) {

        var results = this.noiseBoxes.where({name:name});

        return results[0];
    },

    getNoiseBoxBySocketID : function (id) {

        var foundNoiseBox;

        this.noiseBoxes.each(function (noiseBox) {

            if ( noiseBox.clientExists(id) ) {

                foundNoiseBox = noiseBox;
            }
        });

        return foundNoiseBox;
    }
});