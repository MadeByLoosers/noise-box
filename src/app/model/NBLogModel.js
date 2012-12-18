var Backbone = require("backbone");
var moment = require("./../lib/moment");

var NBLogModel = module.exports = Backbone.Model.extend({

    defaults : {
        log : []
    },


    initialize : function (nb) {
        this.add({
            eventType:"noisebox-created"
        });

        nb.users.on("add",function (nbUserModel) {
           this.add({
                eventType:"user-added",
                user: nbUserModel.get("username")
            });
        },this);

        nb.users.on("change",function (nbUserModel) {
            this.add({
                user: nbUserModel.previous("username"),
                detail: nbUserModel.get("username"),
                eventType: "username-updated"
            });
        },this);

        nb.users.on("remove",function (nbUserModel) {
            this.add({
                eventType:"user-removed",
                user: nbUserModel.get("username")
            });
        },this);

        nb.hosts.on("add",function (nbHostModel) {
            this.add({
                eventType:"host-added"
            });
        },this);

        nb.hosts.on("remove",function (nbHostModel) {
            this.add({
                eventType:"host-removed"
            });

        },this);

        nb.tracks.on("add",function (nbTrackModel) {
            this.add({
                user: nbTrackModel.get("user"),
                detail: nbTrackModel.get("track"),
                datetime: nbTrackModel.get("datetime"),
                eventType: "track-added"
            });
        },this);

        nb.tracks.on("remove",function (nbTrackModel) {
            this.add({
                eventType:"track-removed"
            });
        },this);
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