/*global next*/
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
var moment = require("./../lib/moment");
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");
var AbstractController = require("./abstract.js");
var _ = require("underscore");
var log = require("../lib/log");

var UserController = {

    init : function() {

        // Map route to middleware and rendering function:

        app.get("/:id",templateOptions(),stats(),function (req,res) {

            var id = req.params.id;

            if ( !model.noiseBoxExists(id) ) {

                req.session.flashMessage = "NoiseBox \""+id+"\" does not exist.";
                res.redirect("/");
                return;
            }

            require("../lib/built-in-sfx")(function (err,sfx) {
                if ( err ) {
                    next("Error walking SFX dir");
                    return;
                }
                require("../lib/sfx-metadata-parser")(sfx,function (err,sfx) {
                    if ( err ) {
                        next(new Error("Error parsing SFX metadata"));
                        return;
                    }
                    console.log("rendering response");
                    res.extendTemplateOptions({
                        title: id + " | " + res.templateOptions.title,
                        clientType : constants.TYPE_USER,
                        id : id,
                        files : sfx,
                        userURL : res.templateOptions.host+"/"+id,
                        username : "",
                        cid : "",
                        userid: ""
                    });
                    res.render(constants.TYPE_USER,res.templateOptions);
                });
            });
        });

        // Attach socket events:

        io.sockets.on(constants.CLIENT_SOCKET_CONNECTION,function (socket) {

            socket.on(constants.USER_CONNECT,function (data) {
                UserController.onConnect(data,socket);
            });

            socket.on(constants.SOCKET_DISCONNECT,function (data) {
                UserController.onDisconnect(data,socket);
            });

            socket.on(constants.USER_CLICKED_TRACK,function (data) {
                UserController.onUserClickedTrack(data,socket);
            });

            socket.on(constants.USER_NAME_UPDATE,function (data) {
                UserController.onUserNameUpdate(data,socket);
            });
        });
    },


    /**
     * Called when a user client socket has connected.
     *
     * @param data Data object sent from client.
     * @param socket Socket instance for the client.
     */
    onConnect : function (data,socket) {

        var nb = model.getNoiseBox(data.id),
            newUser;

        if ( !nb ) { return; }

        log.info("created user",{socketid:socket.id,noiseboxid:nb.id});

        newUser = nb.addUser(socket.id,socket);

        socket.emit(constants.USER_ADDED,{
            username: newUser.get("username"),
            cid:newUser.cid,
            userid:newUser.get("id")
        });
    },


    /**
     * Generic socket disconnect. This callback is called when *any* socket disconnects (not just
     * user clients) so we need to check that the disconnecting client is a user, and if so remove
     * it from the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    onDisconnect : function (data,socket) {

        var nb = model.getNoiseBoxByClientSocketID(socket.id);

        if ( !nb ) { return; }

        if ( nb.userExists(socket.id) ) {

            log.info("removed user",{socketid:socket.id,noiseboxid:nb.id});

            nb.removeUser(socket.id);
        }
    },


    /**
     * A user has clicked on track, so update the relevant NoiseBox's track property in the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    onUserClickedTrack : function (data,socket) {

        var nb = model.getNoiseBox(data.id),
            user,
            track = {};

        if ( !nb ) { return; }

        user = nb.getUser(socket.id);
        if (!user) { return; }

        track.user = user.get("username");
        track.datetime = moment().format("YYYY-MM-DD hh:mm:ss");
        track.track = data.track;
        track.trackId = data.trackId;

        log.info("track clicked",{socketid:socket.id,track:data.track,noiseboxid:data.id});

        nb.addTrack(track);
    },


    /**
     * A user has updated their username, so update the relevant NoiseBox user's property in the model.
     *
     * @param data Data object sent from the client.
     * @param socket Socket instance that has disconnected.
     */
    onUserNameUpdate : function (data, socket) {

        var nb = model.getNoiseBox(data.id),
            user;

        if ( !nb ) { return; }

        user = nb.getUser(data.userid);
        nb.updateUsername(user, data.username);
    }
};


_.extend(UserController, AbstractController);

module.exports = UserController;
