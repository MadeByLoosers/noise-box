/**
 * NoiseBox
 * host.js
 *
 * Host route controller.
 */

var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");
var AbstractController = require("./abstract.js");
var _ = require("underscore");


var HostController = function () {

    // Map route to middleware and rendering function:

    app.get("/host/:id",templateOptions(),stats(),function (req,res) {

        var id = req.params.id;

        if ( !model.noiseBoxExists(id) ) {

            req.session.flashMessage = "NoiseBox '"+id+"' does not exist.";
            res.redirect("/");
            return;
        }

        res.extendTemplateOptions({
            title: "Hosting " + id + " | " + res.templateOptions.title,
            clientType:constants.TYPE_HOST,
            userURL : res.templateOptions.host+"/"+id,
            id : id
        });

        res.render(constants.TYPE_HOST,res.templateOptions);
    });

    app.post("/host",function (req,res) {

        var id = req.body.id;

        var msg;
        var error = false;

        if ( typeof id === "undefined" ) {
            error = true;
            msg = "Uh oh, something's wrong. Try again later ...";
        }

        if ( !isValidNoiseBoxID(id) ) {
            error = true;
            msg = "That isn't a valid NoiseBox name. The name must be 20 characters or less and consist only of letters and numbers with no spaces.";
        }

        if ( model.noiseBoxExists(id) ) {
            error = true;
            msg = "Unable to create that NoiseBox, try a different name ...";
        }

        if ( error ) {
            req.session.flashMessage = msg;
            res.redirect("/");
        } else {
            console.log("Created NoiseBox '%s'",id);
            model.addNoiseBox(id);
            res.redirect("/host/"+id);
        }
    });

    // Attach socket events:

    io.sockets.on(constants.CLIENT_SOCKET_CONNECTION,function (socket) {

        socket.on(constants.HOST_CONNECT,function (data) {
            onConnect(data,socket);
        });

        socket.on(constants.SOCKET_DISCONNECT,function (data) {
            onDisconnect(data,socket);
        });
    });
};

_.extend(HostController, AbstractController);

module.exports = HostController;