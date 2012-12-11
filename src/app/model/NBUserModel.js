var Backbone = require("backbone");

var NBUserModel = module.exports = Backbone.Model.extend({

    defaults : {
        id : "",
        parentNoiseBoxID : "",
        socket : "",
        username : ""
    },


    initialize : function () {
      this.updateUsername();
    },


    updateUsername : function(username) {
      if (!username) {
        username = this.cid.replace("c", "user_");
      }
      this.set("username", username);
    }
});