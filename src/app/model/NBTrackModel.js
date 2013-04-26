var Backbone = require("backbone");

var NBTrackModel = module.exports = Backbone.Model.extend({

    defaults : {
      track: "",
      trackId: "",
      user: "",
      datetime: "",
      played:false
    },

    initialize : function (data) {
    }
});