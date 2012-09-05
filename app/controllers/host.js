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

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/host/:noiseBoxName",templateOptions(),stats(),function (req,res) {

        var noiseBoxName = req.params.noiseBoxName;

        if ( !model.noiseBoxExists(noiseBoxName) ) {

            req.session.flashMessage = "NoiseBox '"+noiseBoxName+"' does not exist.";
            res.redirect("/");
            return;
        }

        res.extendTemplateOptions({

            clientType:constants.TYPE_HOST,
            userURL : res.templateOptions.host+"/"+noiseBoxName,
            noiseBoxName : noiseBoxName
        });

        res.render(constants.TYPE_HOST,res.templateOptions);
    });

    app.post("/host",function (req,res) {

        var noiseBoxName = req.body.noiseBoxName;

        var msg;
        var error = false;

        if ( typeof noiseBoxName === "undefined" ) {
            error = true;
            msg = "Uh oh, something's wrong. Try again later ...";
        }

        if ( !isValidNoiseBoxName(noiseBoxName) ) {
            error = true;
            msg = "That isn't a valid NoiseBox name. The name must be 20 characters or less and consist only of letters and numbers with no spaces.";
        }

        if ( model.noiseBoxExists(noiseBoxName) ) {
            error = true;
            msg = "Unable to create that NoiseBox, try a different name ...";
        }

        if ( error ) {
            req.session.flashMessage = msg;
            res.redirect("/");
        } else {
            console.log("Created NoiseBox '%s'",noiseBoxName);
            model.addNoiseBox(noiseBoxName);
            res.redirect("/host/"+noiseBoxName);
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

    // Start listening for updates from the model:

    model.on(constants.USER_ADDED,updateNoiseBoxStats);
    model.on(constants.USER_REMOVED,updateNoiseBoxStats);
    model.on(constants.HOST_ADDED,updateNoiseBoxStats);
    model.on(constants.HOST_REMOVED,updateNoiseBoxStats);
    model.on(constants.TRACK_CHANGED,trackChanged);

    // Define module methods:

    function onConnect (data,socket) {

        var noiseBox = model.getNoiseBox(data.noiseBoxName);

        if ( !noiseBox ) { return; }

        console.log("Created host '%s' for NoiseBox '%s'",socket.id,data.noiseBoxName);

        noiseBox.addHost(socket.id,socket);
    }

    function onDisconnect (data,socket) {

        var noiseBox = model.getNoiseBoxByClientSocketID(socket.id);

        if ( !noiseBox ) { return; }

        if ( noiseBox.hostExists(socket.id) ) {

            console.log("Removed host '%s' for NoiseBox '%s'",socket.id,noiseBox.id);

            noiseBox.removeHost(socket.id);
        }
    }

    function trackChanged (nbModel) {

        nbModel.hosts.each(function (nbHostModel) {

            nbHostModel.get("socket").emit(constants.SERVER_PLAY_TRACK_REQUEST,{track:nbModel.get("track")});
        });
    }

    function updateNoiseBoxStats (nbClientModel) {

        var noiseBox = model.getNoiseBox(nbClientModel.get("parentNoiseBoxID"));

        if ( !noiseBox ) { return; }

        noiseBox.hosts.each(function (nbHostModel) {

            nbHostModel.get("socket").emit(constants.SERVER_NOISE_BOX_STATS_UPDATED,{numHosts:noiseBox.hosts.length,numUsers:noiseBox.users.length});
        });
    }

    /**
     * Validate a NoiseBox name.
     */
    function isValidNoiseBoxName (noiseBoxName) {

        var valid = true;

        if ( typeof noiseBoxName !== "string" ) {
            valid = false;
        }

        if ( noiseBoxName === "" ) {
            valid = false;
        }

        if ( noiseBoxName.length > 20 ) {
            valid = false;
        }

        if ( !noiseBoxName.match(/^[a-zA-Z0-9]+$/) ) {
            valid = false;
        }

        return valid;
    }
};