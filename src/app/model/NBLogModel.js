var Backbone = require("backbone");
var moment = require("./../lib/moment");

var NBLogModel = module.exports = Backbone.Model.extend({

    defaults : {
        log : []
    },


    initialize : function () {
    },


    // log an event on the noise box
    // getting and setting in this manner should fire a change event
    // http://stackoverflow.com/a/7325167
    add : function (event) {

        var log = this.get("log"),
            item = {
                user : event && event.user || undefined,
                detail: event && event.detail || undefined,
                eventType: event && event.eventType || undefined,
                datetime: event && event.datetime || moment().format("YYYY-MM-DD hh:mm:ss")
            };

        log.push(item);

        this.set("log", log);

        // TODO: manually firing a change event
        this.trigger("change", item, this);
        this.trigger("change:log", item, this);

        console.log("LOG:", item);
    }
});