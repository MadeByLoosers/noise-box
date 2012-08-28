var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/",templateOptions(),stats(),function(req,res){

        res.extendTemplateOptions({

            clientType:constants.TYPE_HOME
        });

        res.render(constants.TYPE_HOME,res.templateOptions);
    });

    // Attach home page specific socket events:

    io.sockets.on(constants.CLIENT_SOCKET_CONNECTION,function (socket) {

        socket.on(constants.HOME_CONNECT,function (data) {
            onConnect(data,socket);
        });

        socket.on(constants.SOCKET_DISCONNECT,function (data) {
            onDisconnect(data,socket);
        });
    });

    // Start listening for updates in the model:

    model.homeClients.on("add remove",onNumClientsChanged);

    model.noiseBoxes.each(function (noiseBox) {

        noiseBox.hosts.each(function (host) {

            host.on("add remove",onNumClientsChanged);
        });

        noiseBox.users.each(function (user) {

            user.on("add remove",onNumClientsChanged);
        });
    });

    // Define module methods:

    function onConnect (data,socket) {

        console.log("home client connected "+socket.id);

        model.addHomeClient(socket.id,socket);
    }

    function onDisconnect (data,socket) {

        console.log("home client disconnected "+socket.id);

        model.removeHomeClient(socket.id);
    }

    function onNumClientsChanged (homeClient) {

        model.homeClients.each(function (homeClient) {

            homeClient.get("socket").emit(constants.SERVER_APP_STATS_UPDATED,{numNoiseBoxes:model.noiseBoxes.length,numClients:model.getNumConnectedClients()});
        });
    }
};