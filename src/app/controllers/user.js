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
var fh = require("./../lib/file-helper");
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/:id",templateOptions(),function (req,res) {

        var id = req.params.id;

        if ( !model.noiseBoxExists(id) ) {

            req.session.flashMessage = "NoiseBox \""+id+"\" does not exist.";
            res.redirect("/");
            return;
        }

        fh.listFiles("./public/sfx",function (err,files) {

            res.extendTemplateOptions({
                title: id + " | " + res.templateOptions.title,
                clientType : constants.TYPE_USER,
                id : id,
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

        socket.on(constants.USER_CLICKED_TRACK,function (data) {
            onUserClickedTrack(data,socket);
        });
    });

    /**
     * Called when a user client socket has connected.
     *
     * @param data Data object sent from client.
     * @param socket Socket instance for the client.
     */
    function onConnect (data,socket) {

        var nb = model.getNoiseBox(data.id);

        if ( !nb ) { return; }

        console.log("Created user '%s' for NoiseBox '%s'",socket.id,nb.id);

        nb.addUser(socket.id,socket);
    }

    /**
     * Generic socket disconnect. This callback is called when *any* socket disconnects (not just
     * user clients) so we need to check that the disconnecting client is a user, and if so remove
     * it from the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    function onDisconnect (data,socket) {

        var nb = model.getNoiseBoxByClientSocketID(socket.id);

        if ( !nb ) { return; }

        if ( nb.userExists(socket.id) ) {

            console.log("Removed user '%s' for NoiseBox '%s'",socket.id,nb.id);

            nb.removeUser(socket.id);
        }
    }

    /**
     * A user has clicked on track, so update the relevant NoiseBox's track property in the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    function onUserClickedTrack (data,socket) {

        var nb = model.getNoiseBox(data.id);

        if ( !nb ) { return; }

        console.log("User '%s' clicked track '%s' in NoiseBox '%s'",socket.id,data.track,data.id);

        nb.addTrack(data.track);
    }
};