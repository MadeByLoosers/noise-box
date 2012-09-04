/**
 * NoiseBox
 * user.js
 *
 * User route controller.
 */

var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var fh = require("./../../lib/file-helper");
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/:noiseBoxName",templateOptions(),function (req,res) {

        var noiseBoxName = req.params.noiseBoxName;

        if ( !model.noiseBoxExists(noiseBoxName) ) {

            req.session.flashMessage = "NoiseBox \""+noiseBoxName+"\" does not exist.";
            res.redirect("/");
            return;
        }

        fh.listFiles("./public/sfx",function (err,files) {

            res.extendTemplateOptions({

                clientType : constants.TYPE_USER,
                noiseBoxName : noiseBoxName,
                files : files
            });

            res.render(constants.TYPE_USER,res.templateOptions);
        });
    });

    // Attach socket events:

    io.sockets.on(constants.CLIENT_SOCKET_CONNECTION,function (socket) {

        socket.on(constants.USER_CONNECT,function (data) {
            onConnect(data,socket);
        });

        socket.on(constants.SOCKET_DISCONNECT,function (data) {
            onDisconnect(data,socket);
        });
    });

    // Start listening for updates from the model:

    // Define module methods:

    function onConnect (data,socket) {

        var noiseBox = model.getNoiseBox(data.noiseBoxName);

        if ( !noiseBox ) { return; }

        console.log("Created user '%s' for NoiseBox '%s'",socket.id,noiseBox.id);

        noiseBox.addUser(socket.id,socket);
    }

    function onDisconnect (data,socket) {

        var noiseBox = model.getNoiseBoxByClientSocketID(socket.id);

        if ( !noiseBox ) { return; }

        if ( noiseBox.userExists(socket.id) ) {

            console.log("Removed user '%s' for NoiseBox '%s'",socket.id,noiseBox.id);

            noiseBox.removeUser(socket.id);
        }
    }
};