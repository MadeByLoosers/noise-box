/**
 * NoiseBox
 * home.js
 *
 * Home route controller.
 */

var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");

module.exports = function () {
    "use strict";

    // Map route to middleware and rendering function:

    app.get("/",templateOptions(),stats(),function (req,res) {

        res.extendTemplateOptions({

            clientType:constants.TYPE_HOME
        });

        res.render(constants.TYPE_HOME,res.templateOptions);
    });

    // Attach socket events:

    io.sockets.on(constants.CLIENT_SOCKET_CONNECTION,function (socket) {

        socket.on(constants.HOME_CONNECT,function (data) {
            onConnect(data,socket);
        });

        socket.on(constants.SOCKET_DISCONNECT,function (data) {
            onDisconnect(data,socket);
        });
    });

    // Start listening for updates from the model:
    (function(){
        model.on(constants.NOISEBOX_ADDED,updateServerStats);
        model.on(constants.NOISEBOX_REMOVED,updateServerStats);
        model.on(constants.HOME_ADDED,updateServerStats);
        model.on(constants.HOME_REMOVED,updateServerStats);
        model.on(constants.USER_ADDED,updateServerStats);
        model.on(constants.USER_REMOVED,updateServerStats);
        model.on(constants.HOST_ADDED,updateServerStats);
        model.on(constants.HOST_REMOVED,updateServerStats);
    }());
    /**
     * Called when a home client socket has connected.
     *
     * @param data Data object sent from client.
     * @param socket Socket instance for the client.
     */
    function onConnect (data,socket) {

        console.log("Created home client '%s'",socket.id);

        model.addHomeClient(socket.id,socket);
    }

    /**
     * Generic socket disconnect. This callback is called when *any* socket disconnects (not just
     * home clients) so we need to check that the disconnecting client is a home client, and if so
     * remove it from the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    function onDisconnect (data,socket) {

        if ( model.homeClientExists(socket.id) ) {

            console.log("Removed home client '%s'",socket.id);

            model.removeHomeClient(socket.id);
        }
    }

    /**
     * A NoiseBox has been added or removed, or some sort of client has been added or removed (home,
     * user or host) so we loop through all the home clients and update their stats.
     */
    function updateServerStats () {

        model.homeClients.each(function (homeClient) {

            homeClient.get("socket").emit(constants.SERVER_APP_STATS_UPDATED,{numNoiseBoxes:model.noiseBoxes.length,numClients:model.getNumConnectedClients()});
        });
    }
};