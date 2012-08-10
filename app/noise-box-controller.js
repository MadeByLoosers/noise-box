/**
 * NoiseBox
 * noise-box-controller.js
 *
 * Emits and listens to socket events and manipulates the model.
 */

var _ = require("underscore");
var AppModel = require("./model/AppModel");
var util = require("util");

module.exports = function(io) {

    // Module string constants

    var TYPE_HOME = "home";
    var TYPE_HOST = "host";
    var TYPE_USER = "room";

    var CLIENT_CONNECTION = "connection";
    var CLIENT_DISCONNECT = "disconnect";

    var SERVER_PLAYLIST_UPDATED = "serverPlaylistUpdated";
    var SERVER_PLAY_REQUEST = "serverPlayRequest";
    var SERVER_PAUSE_REQUEST = "serverPauseRequest";
    var SERVER_SKIP_REQUEST = "serverSkipRequest";
    var SERVER_STATS_UPDATED = "serverStatsUpdated";

    var HOST_CONNECT = "hostConnect";
    var HOST_TRACK_COMPLETE = "hostTrackComplete";

    var USER_CONNECT = "userConnect";
    var USER_TRACK_CLICKED = "userTrackClicked";

    // Create model

    var model = new AppModel();

    // Map socket events to module methods

    io.sockets.on(CLIENT_CONNECTION,function (socket) {

        socket.on(HOST_CONNECT,function (data) {

            onHostConnect(data,socket);
        });

        socket.on(USER_CONNECT,function (data) {

            onUserConnect(data,socket);
        });

        socket.on(CLIENT_DISCONNECT,function (data) {

            onClientDisconnect(socket);
        });
    });

    /**
     * Called when a host connects. This method determines whether the host is trying to connect
     * to a NoiseBox that already exists, or a brand new one. The NoiseBox is retrieved or created
     * as needed and a new host added to the model.
     */
    function onHostConnect (data,socket) {

        log(HOST_CONNECT);

        var name = data.name;
        var noiseBox;
        var id = socket.id;

        log("  attemping to connect to noisebox named \""+data.name+"\"");
        log("  host has socket id "+id);

        if ( model.noiseBoxExists(name) ) {

            log("  noisebox exists");

            noiseBox = model.getNoiseBox(name);
        }
        else
        {
            log("  noisebox doesn't exist, creating");

            noiseBox = model.addNoiseBox(name);
        }

        log("  adding new host to noisebox");

        noiseBox.addHost(id,socket);

        log("  "+getNoiseBoxStats(noiseBox.get("name")));

        notifyNoiseBoxStatsUpdated(noiseBox.get("name"));
    }

    /**
     * Called when a user connects. This method determines whether the user is trying to connect to
     * a NoiseBox that exists, or one that is unknown to the model. If the NoiseBox exists a new
     * user is added to the model.
     */
    function onUserConnect (data,socket) {

        log(USER_CONNECT);

        var name = data.name;
        var noiseBox;
        var id = socket.id;

        log("  attemping to connect to noisebox named \""+data.name+"\"");
        log("  user has socket id "+id);

        if ( model.noiseBoxExists(name) ) {

            log("  noisebox exists");

            noiseBox = model.getNoiseBox(name);

            noiseBox.addUser(id,socket);

            log("  adding new user to noisebox");

            log("  "+getNoiseBoxStats(noiseBox.get("name")));

            notifyNoiseBoxStatsUpdated(noiseBox.get("name"));
        }
        else
        {
            log("  noisebox doesn't exist");
        }
    }

    /**
     * Called when a generic client disconnects. This method determines if the disconnecting client
     * was a user or a host and updates the model accordingly.
     */
    function onClientDisconnect (socket) {

        log("client disconnected");

        var id = socket.id;

        log("  client had socket id "+id);

        var noiseBox = model.getNoiseBoxBySocketID(id);

        if ( noiseBox ) {

            log("  was connected to noisebox \""+noiseBox.get("name")+"\"");

            var clientIsHost = noiseBox.hostExists(id);

            if ( clientIsHost ) {

                log("  client was a host");
                noiseBox.removeHost(id);
            } else {

                log("  client was a user");
                noiseBox.removeUser(id);
            }

            log("  removing client");

            log("  "+getNoiseBoxStats(noiseBox.get("name")));

            notifyNoiseBoxStatsUpdated(noiseBox.get("name"));
        } else {

            log("  client wasn't conneted to any noisebox");
        }
    }

    function notifyNoiseBoxStatsUpdated (name) {

        var noiseBox = model.getNoiseBox(name);

        noiseBox.hosts.each(function (host) {

            host.get("socket").emit(SERVER_STATS_UPDATED,{numHosts:noiseBox.hosts.length,numUsers:noiseBox.users.length});
        });
    }

    /**
     * Debugging helper function. Generates a string containing stats about the named NoiseBox.
     *
     * @param name NoiseBox name.
     */
    function getNoiseBoxStats (name) {

        var noiseBox = model.getNoiseBox(name);

        if ( noiseBox ) {
            var numTracks = noiseBox.playlist.length;
            var numHosts = noiseBox.hosts.length;
            var numUsers = noiseBox.users.length;

            return "["+name+"] "+numTracks+" tracks, "+numHosts+" hosts, "+numUsers+" users";
        } else {

            return "invalid noisebox name";
        }
    }


    /**
     * Logging helper function. Simply logs or introspects items depending on the options passed in.
     *
     * @param item Item to log.
     * @param inspect Boolean value indicating whether to introspect the item with util.inspect.
     * @param level Introspection depth, defaults to 0.
     */
    function log (item,inspect,level) {

        level = typeof level !== "undefined" ? level : 0;

        if ( inspect ) {
            console.log(util.inspect(item,false,level,true));
        } else {
            console.log(item);
        }
    }

    /**
     * Access a reference to the AppModel instance.
     */
    function getAppModel () {

        return model;
    }

    // Expose the module API

    return {
        getAppModel : getAppModel
    };
};