var Backbone = require("backbone");

var NBTrackModel = module.exports = Backbone.Model.extend({

    defaults : {
      track: "",
      trackName: "",
      trackId: "",
      album: "",
      user: "",
      datetime: "",
      played:false
    },

    initialize : function (data) {
    }
});